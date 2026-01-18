# NeoEdx v1 外部 API 行为面（API Surface）

> 目的：从“行为与边界”角度定义 v1 对外提供的 API 能力清单（按用例/客户端分组），供第二步（新实现设计）落地为具体协议/路由。  
> 范围：v1 In-scope（见 `neoEdx/06_v1_Scope_and_MVP.md`），并与领域契约对齐（见 `neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/09_v1_Event_Schemas.md`）。

## 1. 原则

- API 以**用例（Use Case）**表达，不以页面/数据库/微服务划分。
- 每个 API 操作必须指向一个 **Owner Domain**（最终写入/判定来源）。
- 所有写操作必须支持幂等（`idempotency_key`），并返回可追踪的 `correlation_id`（语义）。
- API 返回必须避免 PII 泄露；用户展示信息来自 Identity 的最小公开视图（见 `neoEdx/08_v1_Data_Ownership_and_Keys.md`）。

## 2. 通用约定（不绑定协议）

### 2.1 鉴权与上下文

每个请求在语义上携带：

- `actor.user_id`（若已登录）
- `actor.roles`（全局/课程内角色的语义集合）
- `actor.locale/timezone`（可选）
- `correlation_id`（客户端可传入；服务端若缺失则生成）

### 2.2 幂等（写操作）

写操作请求应携带：

- `idempotency_key`：客户端生成，确保重试不产生重复副作用

### 2.3 分页与排序（列表查询）

- `page_size`、`page_token`（游标语义）
- `sort`（语义字段名）
- 响应包含 `next_page_token`

### 2.4 错误语义（最小）

与 `neoEdx/07_Domain_Contracts_v1.md` 的错误语义一致：`VALIDATION_ERROR`、`AUTH_REQUIRED`、`FORBIDDEN`、`NOT_FOUND`、`CONFLICT`、`TEMPORARY_UNAVAILABLE`。

---

## 3. 学习端（Learner Experience）API

### 3.1 目录发现（Catalog）

| Use Case | Operation（语义） | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|-------------------|--------------|------|----------|----------|
| 搜索课程 | `SearchCatalog(query, filters, actor_context)` | Catalog | 可匿名 | query/filters | 课程条目列表（仅可见） |
| 课程详情 | `GetCatalogEntry(course_run_id, actor_context)` | Catalog | 可匿名 | course_run_id | 课程详情（含价格/权益展示） |

> 备注：价格/权益展示来自 Commerce 的公开视图；“可报名”以 Enrollment 判定为准，Catalog 仅展示信息与可见性。

### 3.2 账号与身份（Identity）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 注册 | `RegisterUser(email, password, profile)` | Identity | 否 | email/password | user_id |
| 邮箱验证 | `VerifyEmail(user_id, token)` | Identity | 否 | token | verified |
| 登录 | `Authenticate(credentials)` | Identity | 否 | credentials（需已验证） | session_ref（语义） |
| 密码重置 | `RequestPasswordReset(email)` / `CompletePasswordReset(...)` | Identity | 否 | email/token | completed |

> v1 不包含第三方登录（OAuth/SAML 等），但保留扩展点。

### 3.3 报名与购买（Enrollment + Commerce）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 免费报名 | `Enroll(user_id, course_run_id, mode=audit)` | Enrollment | 是 | course_run_id | enrollment_id + access summary |
| 创建订单 | `CreateOrder(user_id, sku_ref, course_run_id)` | Commerce | 是 | sku_ref | order_id + payable summary |
| 确认支付 | `ConfirmPayment(order_id, payment_ref)` | Commerce | 是 | payment_ref | paid（语义） |
| 查询报名状态 | `GetEnrollment(user_id, course_run_id)` | Enrollment | 是 | course_run_id | status/mode/entitlement_state |

> 备注：支付成功后权益生效通过 Enrollment 完成（见 `OrderPaid` → `EnrollmentChanged`）。

### 3.4 学习与进度（Content）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 获取学习序列 | `GetLearningSequence(user_id, course_run_id)` | Content | 是 | course_run_id | 结构与可学习内容视图 |
| 获取单元内容 | `GetContentUnit(user_id, course_run_id, content_ref)` | Content | 是 | content_ref | 单元内容（按发布版本） |
| 记录进度 | `RecordProgress(user_id, course_run_id, content_ref, progress_state)` | Content | 是 | progress_state（访问/完成度%） | acknowledged |

> `RecordProgress` 的存储口径由 Content 定义；Reporting 聚合展示但不回写。

### 3.5 提交与成绩（Grades）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 提交答案 | `SubmitAttempt(user_id, course_run_id, content_ref, answer_payload, content_snapshot_ref)` | Grades | 是 | answer_payload | submission_id |
| 查看成绩 | `GetGrades(user_id, course_run_id)` | Grades | 是 | course_run_id | 分项+汇总成绩 |

> v1 可将 `content_snapshot_ref` 由服务端生成并返回，再由客户端随提交回传；具体策略由实现决定，但必须满足“提交引用快照”的不变量。

### 3.6 证书（Certificates）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 查看证书 | `GetCertificate(user_id, course_run_id)` | Certificates | 是 | course_run_id | 证书状态与下载引用（语义） |
| 验证证书 | `VerifyCertificate(verify_ref)` | Certificates | 可匿名 | verify_ref | valid/state |

### 3.7 讨论（Discussion）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 列表/详情 | `ListThreads(course_run_id, actor_context)` / `GetThread(thread_id, actor_context)` | Discussion | 是（v1） | course_run_id/thread_id | 讨论视图 |
| 发帖 | `CreateThread(user_id, course_run_id, title, body, type)` | Discussion | 是 | title/body | thread_id |
| 回复 | `CreateComment(user_id, thread_id, body)` | Discussion | 是 | body | comment_id |

### 3.8 通知（Notifications）

| Use Case | Operation | Owner Domain | 认证 | 关键输入 | 关键输出 |
|----------|----------|--------------|------|----------|----------|
| 通知列表 | `ListNotifications(user_id, filters)` | Notifications | 是 | filters | 通知列表 |
| 标记已读 | `MarkAsRead(user_id, notification_id)` | Notifications | 是 | notification_id | updated |
| 偏好管理 | `GetPreferences(user_id)` / `UpdatePreference(user_id, patch)` | Notifications | 是 | patch | preferences |

> v1 仅要求站内通知；邮件通知在 v2 规划中（见 `neoEdx/13_v1_Open_Questions_and_Assumptions.md`）。

---

## 4. 创作端（Authoring / Studio）API

### 4.1 课程创建与配置（Course）

| Use Case | Operation | Owner Domain | 认证 | 权限（语义） |
|----------|----------|--------------|------|--------------|
| 创建课程 run | `CreateCourseRun(metadata)` | Course | 是 | course_author |
| 更新课程配置 | `UpdateCourseRun(course_run_id, patch)` | Course | 是 | course_author 或 course_staff |
| 发布课程 run | `PublishCourseRun(course_run_id)` | Course | 是 | course_author |
| 查询课程配置 | `GetCourseRun(course_run_id)` | Course | 是 | course_staff |

### 4.2 内容编辑与发布（Content）

| Use Case | Operation | Owner Domain | 认证 | 权限（语义） |
|----------|----------|--------------|------|--------------|
| 编辑结构 | `UpdateCourseStructure(course_run_id, structure_patch)` | Content | 是 | content_editor |
| 编辑内容块 | `UpsertContentBlock(course_run_id, block)` | Content | 是 | content_editor |
| 发布内容版本 | `PublishContent(course_run_id)` | Content | 是 | content_publisher |

---

## 5. 教学端（Teaching Console）API

### 5.1 手动评分与成绩处置（Grades）

| Use Case | Operation | Owner Domain | 认证 | 权限（语义） | 关键审计字段 |
|----------|----------|--------------|------|--------------|--------------|
| 查看提交 | `ListSubmissions(course_run_id, filters)` | Grades | 是 | grader/staff | — |
| 手动评分 | `ManualGrade(submission_id, score, feedback, reason)` | Grades | 是 | grader/staff | reason/actor |
| 查看学员成绩 | `GetGrades(user_id, course_run_id)` | Grades | 是 | staff | — |

### 5.2 教学看板与导出（Reporting）

| Use Case | Operation | Owner Domain | 认证 | 权限（语义） |
|----------|----------|--------------|------|--------------|
| 进度看板 | `GetProgressDashboard(course_run_id, filters, actor_context)` | Reporting | 是 | staff |
| 创建导出 | `CreateExportJob(requested_by, course_run_id, report_type, filters)` | Reporting | 是 | staff |
| 查询导出 | `GetExportJob(job_id, actor_context)` | Reporting | 是 | staff |

---

## 6. 运营/管理端（Admin / Operations）API

> v1 仅提供“把系统跑起来”的最小配置与可观测入口；复杂审计与治理留到 v1+。

### 6.1 平台配置（Platform）

| Use Case | Operation | Owner Domain | 认证 | 权限（语义） |
|----------|----------|--------------|------|--------------|
| 查看站点配置 | `GetSiteConfig()` | Platform | 是 | admin |
| 更新站点配置 | `UpdateSiteConfig(patch)` | Platform | 是 | admin |
| 查看集成配置（脱敏） | `GetIntegrationConfig(type)` | Platform | 是 | admin |

### 6.2 目录发布（Catalog）

| Use Case | Operation | Owner Domain | 认证 | 权限（语义） |
|----------|----------|--------------|------|--------------|
| 覆盖目录展示信息 | `UpsertCatalogEntry(course_run_id, marketing_info, visibility_rules)` | Catalog | 是 | operator/admin |

---

## 7. v1 外部 API 覆盖检查（对齐矩阵）

- 覆盖矩阵：`neoEdx/05_Behavior_Coverage_Matrix.md` 的 v1 In 行为应能通过本文件的操作组合实现。
- 若新增 v1 行为，必须同时更新：
  - `neoEdx/06_v1_Scope_and_MVP.md`
  - `neoEdx/07_Domain_Contracts_v1.md`
  - `neoEdx/09_v1_Event_Schemas.md`（若涉及事件）

---

*文档版本：1.0*
*v1 API 行为面（用于第二步新实现设计）*
