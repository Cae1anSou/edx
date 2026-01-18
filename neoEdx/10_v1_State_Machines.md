# NeoEdx v1 关键状态机（State Machines）

> 目的：为 v1 冻结“关键状态”及其允许的迁移，避免跨域协作时出现冲突语义与不可恢复状态。  
> 范围：v1 In-scope 的状态实体（见 `neoEdx/06_v1_Scope_and_MVP.md`、`neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/09_v1_Event_Schemas.md`）。  
> 原则：技术无关；状态归属 Owner Domain；跨域只能通过公开命令/事件触发迁移。

## 1. 全局约定

- 状态机只描述**业务语义**，不约束实现（同步/异步、存储、消息中间件等）。
- 每次状态迁移必须可追溯：`actor`、`occurred_at`、`correlation_id`（语义）。
- 所有“异步完成”的状态机必须提供**可观测的中间态**（例如 generating、running）。

---

## 2. Course（课程 run 生命周期状态机）

**Owner Domain**：Course  
**核心实体**：CourseRun

### 2.1 状态

- `draft`：草稿（仅创作/教学团队可见，语义）
- `published`：已发布（对外发布事实已发生，是否可见由 Catalog 决定）
- `archived`：已归档（v1 可先不启用；保留语义）

### 2.2 允许迁移

| From | Trigger (Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------|----|---------------|-------------|
| — | `CreateCourseRun` | `draft` | — | 创建即 draft |
| `draft` | `PublishCourseRun` | `published` | `CoursePublished` | 发布事实不可逆（v1 不支持回退） |
| `published` | `UpdateCourseRun` | `published` | `CourseUpdated` | 变更需声明 `changed_fields` |
| `draft` | `UpdateCourseRun` | `draft` | `CourseUpdated`（可选） | v1 可选择仅在 published 后发事件 |

### 2.3 关键不变量

- “发布”是 Course 的事实状态；Catalog 的“可见”是展示状态，二者不得混淆。
- `policy_refs` 仅是引用关系；具体策略解释权在对应 Owner Domain（见 `neoEdx/08_v1_Data_Ownership_and_Keys.md`）。

---

## 3. Content（内容发布状态机）

**Owner Domain**：Content  
**核心实体**：ContentVersion（课程内容发布版本）

### 3.1 状态

- `editing`：编辑中（草稿内容）
- `published`：已发布（形成 `content_version_id`，供学习/评分引用）

### 3.2 允许迁移

| From | Trigger (Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------|----|---------------|-------------|
| — | `UpsertContentBlock` / `UpdateCourseStructure` | `editing` | — | 编辑行为不必发跨域事件 |
| `editing` | `PublishContent` | `published` | `ContentPublished` | 产生新的 `content_version_id` |
| `published` | `UpsertContentBlock` / `UpdateCourseStructure` | `editing` | — | 产生新的编辑分支（语义） |

### 3.3 关键不变量

- v1 必须支持 `content_snapshot_ref`：用于提交/评分的可复现输入引用；一旦被某个 `submission_id` 绑定，**不可变**。

---

## 4. Catalog（目录条目发布状态机）

**Owner Domain**：Catalog  
**核心实体**：CatalogEntry

> v1 只要求“可被发现与展示”的最小能力；复杂运营（多阶段发布、AB test、专题）可后置。

### 4.1 状态

- `hidden`：不可见（不出现在搜索结果）
- `visible`：可见（可被搜索/查看详情）

### 4.2 允许迁移

| From | Trigger (Command/Event) | To | Emits | 备注/不变量 |
|------|--------------------------|----|-------|-------------|
| — | `CoursePublished`（输入事件） | `visible`（默认） | （可选）`CatalogEntryPublished` | 可见性规则决定是否默认 visible |
| `visible`/`hidden` | `UpsertCatalogEntry` | `visible`/`hidden` | （可选）`CatalogEntryUpdated` | v1 可不发 Catalog 事件 |

### 4.3 关键不变量

- Catalog 必须保证：不可见条目不返回给不满足 `actor_context` 的调用者（见 PRD/契约）。

---

## 5. Commerce（订单支付状态机）

**Owner Domain**：Commerce  
**核心实体**：Order

### 5.1 状态

- `created`：订单已创建，等待支付
- `paid`：支付确认成功（发出 `OrderPaid`）
- `failed`：支付失败或超时（v1 可简化）
- `refunded`：已退款（v1 Non-goal，可先不启用）

### 5.2 允许迁移

| From | Trigger (Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------|----|---------------|-------------|
| — | `CreateOrder` | `created` | — | 订单绑定 `user_id`、`course_run_id`、`sku_ref` |
| `created` | `ConfirmPayment` | `paid` | `OrderPaid` | 必须幂等：同一订单重复确认不应重复发有效事件 |
| `created` | （超时/失败） | `failed` | — | v1 可不建模为事件 |

### 5.3 关键不变量

- `OrderPaid` 事件不得携带支付敏感数据（见 `neoEdx/09_v1_Event_Schemas.md`）。
- “支付成功”只代表 Commerce 真值；权益生效由 Enrollment 负责。

---

## 6. Enrollment（报名状态机）

**Owner Domain**：Enrollment  
**核心实体**：EnrollmentRecord（报名记录）

### 6.1 状态（最小）

- `enrolled`：已报名
- `unenrolled`：未报名（或已退课）

### 6.2 扩展属性（非状态，但影响语义）

- `mode`：`audit` / `paid` / …（可扩展）
- `entitlement_state`：`active` / `none` / `revoked`（可扩展）

### 6.3 允许迁移

| From | Trigger (Command/Event) | To | Emits (Event) | 备注/不变量 |
|------|--------------------------|----|---------------|-------------|
| — | `Enroll(user, course_run, mode=audit)` | `enrolled` | `EnrollmentChanged` | 若已 enrolled，应返回 CONFLICT 或幂等成功（需定义） |
| `enrolled` | `Unenroll` | `unenrolled` | `EnrollmentChanged` | 退课后访问权限语义由 Enrollment 输出 |
| `enrolled` | `GrantEntitlementFromOrder`（输入命令；由 `OrderPaid` 触发编排） | `enrolled` | `EnrollmentChanged` | 模式/权益发生变化（audit→paid） |

### 6.4 关键不变量

- 同一（`user_id`,`course_run_id`）在同一时刻最多一个有效 enrollment 状态。
- Enrollment 是“访问许可”的唯一真值来源：Content/Discussion/Grades 必须以 Enrollment 判定为前置。

---

## 7. Grades（提交与评分状态机）

**Owner Domain**：Grades  
**核心实体**：Submission

### 7.1 状态

- `received`：已收到提交（持久化完成，发 `SubmissionReceived`）
- `grading_pending`：等待评分（自动或人工）
- `graded`：已评分（发 `GradeChanged`）

### 7.2 允许迁移

| From | Trigger (Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------|----|---------------|-------------|
| — | `SubmitAttempt` | `received` | `SubmissionReceived` | 必须携带 `content_snapshot_ref` 并绑定不可变 |
| `received` | `AutoGrade` | `graded` | `GradeChanged` | v1 可对部分题型直接 graded |
| `received`/`grading_pending` | `ManualGrade` | `graded` | `GradeChanged` | 手动评分必须留痕（操作者、原因/反馈） |
| `received` | （需要人工） | `grading_pending` | — | 可选：若要体现等待态 |

### 7.3 关键不变量

- 每个 `submission_id` 必须绑定唯一且不可变的 `content_snapshot_ref`。
- `GradeChanged` 必须能追溯到变更类型（auto/manual/recalc 语义）与关联提交（若适用）。

---

## 8. Certificates（证书状态机）

**Owner Domain**：Certificates  
**核心实体**：Certificate

### 8.1 状态（v1 最小）

- `none`：无证书记录（隐含态）
- `generating`：生成中（异步）
- `available`：可下载/可验证

> `revoked` 在 v1 中作为枚举保留（便于兼容），但可标记为 v1+。

### 8.2 允许迁移

| From | Trigger (Event/Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------------|----|---------------|-------------|
| `none` | `GradeChanged`（输入事件，触发评估） | `available` 或 `generating` 或保持 `none` | `CertificateStateChanged`（可选） | v1 目标为近实时；可直接生成可用证书或先进入 generating |
| `generating` | `EvaluateAndIssueCertificate` 完成 | `available` | `CertificateStateChanged` | `eligibility_input_ref` 必须可追溯 |

### 8.3 关键不变量

- `available` 的证书必须包含可验证的 `verify_ref`（对外公开但不泄露 PII）。
- 证书资格判定必须引用 `eligibility_input_ref`（见 `neoEdx/08_v1_Data_Ownership_and_Keys.md`）。

---

## 9. Discussion（讨论内容可见性状态机）

**Owner Domain**：Discussion  
**核心实体**：Thread/Comment

### 9.1 状态（v1 最小）

- `visible`：可见
- `deleted`：已删除（逻辑删除语义）

> `hidden`/`moderated` 等治理态属于 v1+（Support/Trust 深度能力）。

### 9.2 允许迁移

| From | Trigger (Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------|----|---------------|-------------|
| — | `CreateThread` | `visible` | `ThreadCreated` | 发帖前置：Enrollment 允许 |
| — | `CreateComment` | `visible` | `CommentCreated` | 回复前置：Enrollment 允许 |
| `visible` | `DeleteThread/DeleteComment`（v1 可选） | `deleted` | — | v1 可暂不提供删除能力 |

---

## 10. Notifications（通知投递状态机）

**Owner Domain**：Notifications  
**核心实体**：Notification

### 10.1 状态

- `created`：已创建待投递
- `sent`：投递成功
- `failed`：投递失败（可重试语义）
- `skipped`：因偏好/合规策略跳过

### 10.2 允许迁移

| From | Trigger (Event/Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------------|----|---------------|-------------|
| — | 输入事件（GradeChanged/CertificateStateChanged/CommentCreated 等） | `created` | — | 形成通知记录 |
| `created` | `DeliverNotification` | `sent`/`failed`/`skipped` | `NotificationSent` | 必须尊重用户偏好 |
| `failed` | `DeliverNotification`（重试） | `sent`/`failed` | `NotificationSent` | 重试幂等（基于 notification_id） |

**v1 约束**
- v1 仅要求站内通知渠道；邮件渠道在 v2 规划中。

---

## 11. Reporting（导出任务状态机）

**Owner Domain**：Reporting  
**核心实体**：ExportJob

### 11.1 状态

- `created`：任务已创建
- `running`：生成中
- `completed`：完成（有 `result_ref`）
- `failed`：失败（有 error code）

### 11.2 允许迁移

| From | Trigger (Command) | To | Emits (Event) | 备注/不变量 |
|------|--------------------|----|---------------|-------------|
| — | `CreateExportJob` | `created` | `ExportJobCreated` | 必须记录发起人和范围（语义） |
| `created` | `RunExportJob` | `running` | — | 可立即进入 running |
| `running` | 完成 | `completed` | `ExportJobCompleted` | `result_ref` 必须存在 |
| `running` | 失败 | `failed` | `ExportJobCompleted` | `error.code` 必须存在 |

---

## 12. 跨域冲突处理（v1 必须明确的冲突点）

### 12.1 “可见 vs 可报名 vs 可学习”

- Catalog：决定“可见/可发现”
- Enrollment：决定“可报名/已报名/模式/权益”，并输出访问许可判定
- Content/Discussion/Grades：必须以 Enrollment 的访问许可为前置

### 12.2 “成绩变更 vs 证书状态”

- Grades 变更只发事实；Certificates 自己决定是否生成/更新证书。
- 若证书生成异步，必须暴露中间态（generating），并在完成时发 `CertificateStateChanged`。

### 12.3 “事件重复/乱序”

v1 允许事件重复投递；消费者必须：

- 用 `event_id` 幂等去重
- 对乱序具备容忍策略（例如：先收到 `GradeChanged` 再收到 `EnrollmentChanged` 时，证书评估可延迟/重试）

---

*文档版本：1.0*
*v1 关键状态机（用于第二步新实现设计）*
