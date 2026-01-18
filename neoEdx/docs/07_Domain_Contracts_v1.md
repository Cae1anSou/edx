# NeoEdx v1 领域契约（Domain Contracts）

> 目的：把 v1 的跨领域协作“契约化”，用于第二步（新实现设计）落地。  
> 范围：仅覆盖 v1 In-scope（见 `neoEdx/06_v1_Scope_and_MVP.md`）。  
> 原则：技术无关；每个行为归属唯一 Owner Domain；跨域只通过公开的 Commands/Queries/Events。

## 1. 约定（全局一致）

### 1.1 术语

- **Owner Domain**：某业务状态的唯一真值来源（source of truth）。
- **Command**：跨域请求拥有域执行状态变更（可能异步）。
- **Query**：跨域读取公开视图（只读）。
- **Event**：拥有域发布的“事实变化”，消费者自行决定反应（幂等）。

### 1.2 一致性语义（v1 默认）

- 同一域内：强一致（以域内事务语义表达，不绑定实现方式）。
- 跨域：最终一致，靠事件联动；允许短暂延迟，但必须可观测、可追踪。

### 1.3 幂等与追踪

- 所有跨域 Command 支持 `idempotency_key`（同一 key 重放不产生重复副作用）。
- 所有 Event 携带：
  - `event_id`（全局唯一）
  - `occurred_at`
  - `producer_domain`
  - `correlation_id`（贯穿一次用户操作/业务流程）
  - `actor`（谁触发：user/system），以及 `actor_roles`（若适用）

### 1.4 权限与审计（最小语义）

- 每个域的公开能力必须声明：
  - 需要的角色与范围（例如“课程内教师”）
  - 可审计字段（操作者、原因、关联对象）
- v1 至少对以下动作留痕：
  - 手动评分/成绩覆盖（Grades）
  - 证书生成（Certificates）及其资格判定输入引用
  - 付费权益生效（Commerce→Enrollment）

### 1.5 错误语义（不绑定协议）

- `VALIDATION_ERROR`：输入不合法（缺字段/格式/超范围）
- `AUTH_REQUIRED` / `FORBIDDEN`：未认证/无权限
- `NOT_FOUND`：目标对象不存在或对调用者不可见
- `CONFLICT`：状态冲突（例如重复报名、课程不可报名）
- `RATE_LIMITED`：频率限制（可选）
- `TEMPORARY_UNAVAILABLE`：依赖暂不可用（需要重试语义）

---

## 2. v1 事件目录（Event Catalog）

> 事件名称建议遵循“过去式事实”语义：`CoursePublished`、`EnrollmentChanged` 等。

| Event | Producer (Owner) | 典型消费者 | 触发时机（语义） | 最小载荷（logical fields） |
|------|-------------------|------------|------------------|----------------------------|
| `CoursePublished` | Course | Catalog, Notifications, Enrollment(只读刷新), Reporting(可选) | 课程对外发布发生 | `course_id`, `course_run_id`, `visibility_ref`, `enrollment_window_ref` |
| `CourseUpdated` | Course | Catalog(只读刷新), Reporting(可选) | 影响目录/报名/证书/评分策略引用的配置变更 | `course_id`, `course_run_id`, `changed_fields`, `policy_refs` |
| `ContentPublished` | Content | Catalog(可选), Reporting(可选), Grades(只读) | 内容版本发布 | `course_id`, `course_run_id`, `content_version_id` |
| `EnrollmentChanged` | Enrollment | Content, Discussion, Grades, Notifications, Reporting | 学员报名状态或模式/权益发生变化 | `user_id`, `course_run_id`, `enrollment_status`, `mode`, `entitlement_state` |
| `OrderPaid` | Commerce | Enrollment | 支付成功并确认 | `order_id`, `user_id`, `course_run_id`, `purchased_sku`, `amount`, `currency` |
| `SubmissionReceived` | Grades | Reporting(可选), Notifications(可选) | 收到一次提交（已持久化） | `submission_id`, `user_id`, `course_run_id`, `content_ref`, `content_snapshot_ref` |
| `GradeChanged` | Grades | Certificates, Notifications, Reporting | 学员成绩发生变化（含自动/手动） | `user_id`, `course_run_id`, `grade_ref`, `grade_summary` |
| `CertificateStateChanged` | Certificates | Notifications, Catalog(可选) | 证书状态变化（生成中/可用/撤销等） | `certificate_id`, `user_id`, `course_run_id`, `state`, `verify_ref` |
| `ThreadCreated` | Discussion | Notifications | 新讨论帖创建 | `thread_id`, `user_id`, `course_run_id`, `visibility_ref` |
| `CommentCreated` | Discussion | Notifications | 新回复创建 | `comment_id`, `thread_id`, `user_id`, `course_run_id` |
| `NotificationSent` | Notifications | Reporting(可选) | 通知投递尝试完成（成功/失败） | `notification_id`, `user_id`, `channel`, `delivery_state` |
| `ExportJobCreated` | Reporting | Notifications(可选) | 导出任务创建 | `job_id`, `requested_by`, `course_run_id`, `report_type` |
| `ExportJobCompleted` | Reporting | Notifications(可选) | 导出任务完成 | `job_id`, `state`, `result_ref` |

---

## 3. v1 跨域流程契约（Flow Contracts）

### F1：课程发布进入目录（Course → Catalog）

- 主领域：Course（发布事实） + Catalog（目录视图）
- 核心语义：
  - “可见（Catalog）”与“可报名（Enrollment）”分离；Catalog 只承诺展示与可见性规则。
  - Enrollment 的可报名判断以 Course 的报名窗口引用与自身规则为准。
- 触发：
  - Course 发出 `CoursePublished`
- 目录侧最小反应：
  - Catalog 根据 `CoursePublished` 创建/更新 `CatalogEntry`（只读视图）

### F2：付费购买使权益生效（Commerce → Enrollment）

- 主领域：Commerce（订单/支付真值） + Enrollment（报名模式/权益真值）
- 核心语义：
  - 支付成功 ≠ 自动拿证；“可拿证资格”由 Enrollment/Grades/Certificates 合作决定。
  - Enrollment 需能解释“为什么该学员是该模式/权益”并追溯到 order。
- 触发：
  - Commerce 发出 `OrderPaid`
- Enrollment 最小反应：
  - 以幂等方式授予/升级权益，并发 `EnrollmentChanged`

### F3：提交与评分影响证书（Grades → Certificates）

- 主领域：Grades（成绩真值） + Certificates（证书真值）
- 核心语义：
  - 证书资格判定应可复现：引用成绩汇总与课程策略引用（而非“当下查询结果”不可追溯）。
  - v1 目标为“近实时触发”：成绩变更后立即评估证书资格；实现可以异步化，但对用户语义应尽快收敛到最终状态。
- 触发：
  - Grades 发出 `GradeChanged`
- Certificates 最小反应：
  - 评估资格并更新证书状态，发 `CertificateStateChanged`

### F4：讨论回复触发通知（Discussion → Notifications）

- 主领域：Discussion（讨论真值） + Notifications（通知真值）
- 核心语义：
  - Notifications 必须尊重用户偏好（v1：仅站内通知开关；邮件 v2）。
  - Discussion 不负责投递，只发事实事件。
- 触发：
  - Discussion 发 `ThreadCreated` / `CommentCreated`
- Notifications 最小反应：
  - 创建通知并投递，发 `NotificationSent`

### F5：教学导出报表（Reporting ↔ Grades/Enrollment）

- 主领域：Reporting（导出任务/报表视图真值） + Grades/Enrollment（事实来源）
- 核心语义：
  - Reporting 不回写 Grades 真值；仅聚合与导出。
  - 导出任务必须可追踪：谁发起、导出范围、结果引用。

---

## 4. v1 各领域公开契约（Commands / Queries / Events）

> 下文的“接口名”仅是逻辑能力名，不绑定 HTTP/RPC/消息队列等实现方式。

### 4.1 Identity（用户域）

**Owner data**
- 账户、认证状态、用户资料、角色授予（全局/课程内角色引用）

**Commands**
- `RegisterUser(email, password, profile)` → `user_id`
- `VerifyEmail(user_id, token)` → `verified`
- `Authenticate(credentials)` → `session_ref`（语义；v1 要求已完成邮箱验证）
- `RequestPasswordReset(email)` → `reset_flow_ref`
- `CompletePasswordReset(reset_flow_ref, new_password)` → `completed`

**Queries**
- `GetUser(user_id)` → 基本资料（最小公开字段）
- `CheckPermission(actor, action, resource_ref)` → allow/deny（可选；也可下沉到统一授权组件）

**Events**
- `UserRegistered`, `UserVerified`, `UserAuthenticated`, `PasswordResetCompleted`

---

### 4.2 Course（课程域）

**Owner data**
- 课程 run 的生命周期、关键日期、能力开关与“策略引用”（不直接拥有其他域配置）

**Commands**
- `CreateCourseRun(metadata)` → `course_run_id`
- `UpdateCourseRun(course_run_id, patch)` → updated
- `PublishCourseRun(course_run_id)` → published

**Queries**
- `GetCourseRun(course_run_id)` → 元数据 + `policy_refs` + `capability_flags`
- `GetCoursePublishingState(course_run_id)` → 草稿/已发布/归档

**Events**
- `CoursePublished`, `CourseUpdated`

**Invariants**
- 发布后对外可见由 Catalog 决定，但 Course 必须输出“发布事实”与可见性/报名窗口引用（policy refs）。

---

### 4.3 Content（内容域）

**Owner data**
- 课程结构树、内容块、发布版本（content version）

**Commands**
- `UpsertContentBlock(course_run_id, block)` → `block_id`
- `UpdateCourseStructure(course_run_id, structure_patch)` → updated
- `PublishContent(course_run_id)` → `content_version_id`

**Queries**
- `GetLearningSequence(user_id, course_run_id)` → 学习视图（基于权限与发布版本）
- `GetContentForGrading(course_run_id, content_ref, content_version_id|snapshot_ref)` → 评分所需只读内容

**Events**
- `ContentPublished`

**Invariants**
- 学习访问必须以 Enrollment 的资格判断为前置（通过公开查询或由上层编排保证）。

---

### 4.4 Catalog（目录发现域）

**Owner data**
- `CatalogEntry`（只读视图）、集合页、可见性规则（目录语义）

**Commands**
- `UpsertCatalogEntry(course_run_id, marketing_info, visibility_rules)` → entry_id
- `PublishCollection(collection)` → collection_id（v1 可 Deferred）

**Queries**
- `SearchCatalog(query, filters, actor_context)` → result list
- `GetCatalogEntry(course_run_id, actor_context)` → entry detail

**Events**
- `CatalogEntryPublished/Updated`（可选；v1 非必需）

**Invariants**
- 不得把不可见条目返回给调用者（actor_context 必须参与）。

---

### 4.5 Enrollment（注册域）

**Owner data**
- 报名状态、报名模式（audit/paid 等）、权益状态与追溯信息

**Commands**
- `Enroll(user_id, course_run_id, mode)` → enrollment_ref
- `Unenroll(user_id, course_run_id)` → updated
- `GrantEntitlementFromOrder(order_id, user_id, course_run_id, mode)` → updated

**Queries**
- `GetEnrollment(user_id, course_run_id)` → status/mode/entitlement_state
- `CheckAccess(user_id, course_run_id, access_type)` → allow/deny（学习/讨论/提交等语义）

**Events**
- `EnrollmentChanged`

**Invariants**
- 每个（user_id, course_run_id）在同一时刻最多一个有效 enrollment 状态。
- `GrantEntitlementFromOrder` 必须可幂等且可追溯到 order。

---

### 4.6 Commerce（商业域）

**Owner data**
- 订单、支付状态、收据/对账引用

**Commands**
- `CreateOrder(user_id, sku_ref, course_run_id)` → `order_id`
- `ConfirmPayment(order_id, payment_ref)` → paid

**Queries**
- `GetOrder(order_id)` → status/amount/sku/user/course
- `GetPriceAndOffers(course_run_id, actor_context)` → price/discounts（最小展示）

**Events**
- `OrderPaid`

**Invariants**
- 支付成功事件必须可去重（同一 order 不应重复产生有效权益变化）。

---

### 4.7 Grades（成绩域）

**Owner data**
- 提交记录、评分结果、课程成绩汇总、成绩变更留痕

**Commands**
- `SubmitAttempt(user_id, course_run_id, content_ref, answer_payload, content_snapshot_ref)` → `submission_id`
- `AutoGrade(submission_id)` → grade_ref
- `ManualGrade(submission_id, score, feedback, reason)` → grade_ref
- `RecalculateCourseGrade(user_id, course_run_id)` → grade_summary

**Queries**
- `GetSubmission(submission_id)` → submission detail
- `GetGrades(user_id, course_run_id)` → grade breakdown + summary
- `GetCertificateEligibilityInput(user_id, course_run_id)` → stable refs（成绩汇总 + 策略引用 + 关键审计字段）

**Events**
- `SubmissionReceived`, `GradeChanged`

**Invariants**
- 所有评分必须引用可复现的 `content_snapshot_ref` 或等价引用（见 ADR）。
- 手动评分必须留痕（操作者、原因/反馈）。
- v1 默认通过线为 70%（由 `grading_policy_ref` 表达；后续可扩展更复杂策略）。

---

### 4.8 Certificates（证书域）

**Owner data**
- 证书记录、状态、验证引用（verify ref）

**Commands**
- `EvaluateAndIssueCertificate(user_id, course_run_id, eligibility_input_ref)` → certificate_id/state
- `GetCertificateVerification(verify_ref)` → valid/state

**Queries**
- `GetCertificate(user_id, course_run_id)` → certificate state + download ref（语义）
- `VerifyCertificate(verify_ref)` → verification result

**Events**
- `CertificateStateChanged`

**Invariants**
- 证书资格判定必须可追溯到输入引用（eligibility_input_ref），而非仅“实时查询”。

---

### 4.9 Discussion（讨论域）

**Owner data**
- 帖子、回复、可见性状态（可见/隐藏/删除）

**Commands**
- `CreateThread(user_id, course_run_id, title, body, type)` → thread_id
- `CreateComment(user_id, thread_id, body)` → comment_id

**Queries**
- `ListThreads(course_run_id, actor_context)` → threads
- `GetThread(thread_id, actor_context)` → detail

**Events**
- `ThreadCreated`, `CommentCreated`

**Invariants**
- 发帖/回复前置资格最小要求：已报名（通过 Enrollment `CheckAccess` 语义表达）。

---

### 4.10 Notifications（通知域）

**Owner data**
- 通知记录、投递状态、用户偏好

**Commands**
- `CreateNotification(user_id, type, context_ref)` → notification_id
- `DeliverNotification(notification_id)` → delivery_state
- `UpdatePreference(user_id, preference_patch)` → updated
- `MarkAsRead(user_id, notification_id)` → updated

**Queries**
- `ListNotifications(user_id, filters)` → notifications
- `GetPreferences(user_id)` → preferences

**Events**
- `NotificationSent`, `NotificationPreferenceChanged`（可选）

**Invariants**
- 投递必须尊重用户偏好与合规策略（v1：仅站内通知渠道开关）。

---

### 4.11 Reporting（报表分析域）

**Owner data**
- 导出任务、报表定义（最小）、导出结果引用

**Commands**
- `CreateExportJob(requested_by, course_run_id, report_type, filters)` → job_id
- `RunExportJob(job_id)` → state

**Queries**
- `GetProgressDashboard(course_run_id, filters, actor_context)` → dashboard view
- `GetExportJob(job_id, actor_context)` → state/result_ref

**Events**
- `ExportJobCreated`, `ExportJobCompleted`

**Invariants**
- Reporting 不回写成绩真值；只能读取 Grades/Enrollment 的公开视图或消费事件投影。

---

### 4.12 Platform（平台域）

**Owner data**
- 站点级配置（集成点开关、全局策略引用）、审计策略与全局能力开关（语义）

**Commands**
- `UpdateSiteConfig(patch)` → updated

**Queries**
- `GetSiteConfig()` → config
- `GetIntegrationConfig(integration_type)` → config (masked)

**Events**
- `SiteConfigChanged`（可选；v1 非必需）

---

## 5. v1 必须在第二步落地的“契约清单”（Checklist）

- 明确每个跨域流程的 Owner Domain 与“允许调用的命令/查询/事件”集合（不允许隐式共享数据）。
- 为每个 Command 定义：幂等键、权限范围、状态冲突语义（CONFLICT 条件）、审计字段。
- 冻结 v1 事件目录与字段：至少覆盖第 2 节标记为 v1 In 的事件。
- 明确“证书资格输入引用”的最小结构：Enrollment 模式/权益 + Grades 成绩汇总 + Course 策略引用。
- 明确“学习/讨论/提交”三类访问资格检查语义：由 Enrollment 输出统一判定结果（可查询/可缓存，但真值归 Enrollment）。

---

*文档版本：1.0*
*v1 领域契约（用于第二步新实现设计）*
