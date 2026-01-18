# NeoEdx v1 领域事件 Schema（Event Schemas）

> 目的：固化 v1 的事件契约（字段级 schema + 版本策略），用于第二步（新实现设计）落地与跨域协作。  
> 范围：v1 In-scope 事件（源自 `neoEdx/07_Domain_Contracts_v1.md`）。  
> 原则：技术无关；字段语义固定；禁止携带 PII；兼容演进（向后兼容）。

## 1. 事件清单（v1 必须冻结）

以下事件在 v1 必须实现并按本文 schema 产出：

- `CoursePublished`
- `CourseUpdated`
- `ContentPublished`
- `EnrollmentChanged`
- `OrderPaid`
- `SubmissionReceived`
- `GradeChanged`
- `CertificateStateChanged`
- `ThreadCreated`
- `CommentCreated`
- `NotificationSent`
- `ExportJobCreated`
- `ExportJobCompleted`

> 注：`CatalogEntryPublished/Updated`、`SiteConfigChanged` 等可以留到 v1+。

## 2. 事件信封（Event Envelope）

所有事件必须使用统一信封；消费者应首先解析信封，再解析 payload。

### 2.1 Envelope 字段

```yaml
event_id: string            # 全局唯一（去重/幂等）
event_type: string          # 例如 "CoursePublished"
schema_version: string      # 例如 "1.0"
occurred_at: string         # 事件发生时间（ISO-8601 语义）
producer:
  domain: string            # 例如 "Course"
  service: string|null      # 可选：生产者组件名（语义）
actor:
  actor_type: string        # "user" | "system"
  actor_id: string|null     # user_id（若为 user）
  actor_roles: [string]     # 可选：角色语义（如 "course_staff"）
correlation_id: string|null # 同一次业务流程的关联 id（追踪）
causation_id: string|null   # 可选：触发本事件的上游 event_id/command_id
partition_key: string|null  # 可选：建议按 course_run_id 或 user_id（语义）
payload: object             # 事件体（见第 4 节）
```

### 2.2 PII 与敏感数据约束

- 禁止在任何事件中携带：邮箱、手机号、真实姓名、支付敏感信息、身份证明材料等。
- 对外可公开的验证标识（如 `verify_ref`）允许出现，但必须不可逆推出 PII。

### 2.3 兼容性规则

- **新增字段**：只能新增可选字段，且必须有默认语义（消费者可忽略）。
- **删除字段**：v1 内禁止；v1+ 需走 major 版本。
- **字段含义变更**：视为破坏性变更，需提升 major 版本。
- **枚举扩展**：允许新增枚举值，但消费者必须有“未知值”兜底策略。

---

## 3. 通用类型（Logical Types）

这些类型在事件中复用（语义级定义）：

```yaml
UserRef:
  user_id: string

CourseRunRef:
  course_id: string|null
  course_run_id: string

PolicyRefs:
  grading_policy_ref: string|null
  certificate_policy_ref: string|null
  catalog_visibility_ref: string|null
  enrollment_window_ref: string|null
  discussion_policy_ref: string|null
  progress_policy_ref: string|null

Money:
  amount: number
  currency: string

AccessOrVisibilityRef:
  ref: string|null          # 指向拥有域可解析的规则引用

ContentRef:
  content_ref: string       # 指向可评分/可学习对象
  content_block_id: string|null

ContentSnapshotRef:
  content_snapshot_ref: string
  content_version_id: string|null

GradeSummary:
  percent: number|null
  passed: boolean|null
  letter_grade: string|null
  updated_at: string|null

ResultRef:
  result_ref: string        # 指向文件/链接（语义）
  expires_at: string|null
```

---

## 4. 事件 Schema（Per-event Payloads）

> 说明：每个事件的 payload schema 仅定义“跨域需要的最小字段”。域内字段与冗余信息不应进入事件。

### 4.1 `CoursePublished` (schema_version = 1.0)

```yaml
course_run: CourseRunRef
publishing_state: string         # "published"
policy_refs: PolicyRefs
capability_flags:
  discussions_enabled: boolean|null
  certificates_enabled: boolean|null
  paid_enrollment_enabled: boolean|null
```

**不变量**
- 一旦发布，该事实不可撤销（可另发 `CourseArchived`，v1 不含）。

---

### 4.2 `CourseUpdated` (schema_version = 1.0)

```yaml
course_run: CourseRunRef
changed_fields: [string]         # 语义字段名（例如 "policy_refs", "dates", "capability_flags"）
policy_refs: PolicyRefs|null
capability_flags: object|null
```

**不变量**
- `changed_fields` 必须准确覆盖本事件声明的变更范围。

---

### 4.3 `ContentPublished` (schema_version = 1.0)

```yaml
course_run: CourseRunRef
content_version_id: string
published_at: string|null
```

**不变量**
- `content_version_id` 必须可比较（至少可追溯到发布序列/时间）。

---

### 4.4 `EnrollmentChanged` (schema_version = 1.0)

```yaml
course_run: CourseRunRef
user: UserRef
enrollment_status: string        # "enrolled" | "unenrolled"
mode: string|null                # "audit" | "paid" | 其他（允许扩展）
entitlement_state: string|null   # "active" | "none" | "revoked"（允许扩展）
effective_at: string|null
reason: string|null              # 例如 "self_enroll" | "paid_upgrade"（语义，可选）
```

**不变量**
- 同一（user, course_run）在某一时刻只能有一个有效 `enrollment_status`。

---

### 4.5 `OrderPaid` (schema_version = 1.0)

```yaml
order_id: string
user: UserRef
course_run: CourseRunRef
sku_ref: string
total: Money
paid_at: string|null
```

**不变量**
- 不得包含支付敏感信息（卡号/token/渠道返回详情等）。

---

### 4.6 `SubmissionReceived` (schema_version = 1.0)

```yaml
submission_id: string
user: UserRef
course_run: CourseRunRef
content: ContentRef
content_snapshot: ContentSnapshotRef
submitted_at: string|null
```

**不变量**
- `content_snapshot.content_snapshot_ref` 必须不可变，并能复现评分输入。

---

### 4.7 `GradeChanged` (schema_version = 1.0)

```yaml
course_run: CourseRunRef
user: UserRef
grade_ref: string                # 指向可查询的成绩对象
summary: GradeSummary
change_type: string|null         # "auto" | "manual" | "recalc"（允许扩展）
caused_by:
  submission_id: string|null
  override_reason: string|null
occurred_at: string|null         # 可选：成绩变更时间（与 envelope.occurred_at 可能一致）
```

**不变量**
- 若为手动变更，必须能追溯到操作者与原因（原因字段可在 Grades 内部留痕，此处仅可选摘要）。

---

### 4.8 `CertificateStateChanged` (schema_version = 1.0)

```yaml
certificate_id: string
course_run: CourseRunRef
user: UserRef
state: string                    # "generating" | "available" | "revoked"（允许扩展；v1 至少 generating/available）
verify_ref: string|null
eligibility_input_ref: string|null
updated_at: string|null
```

**不变量**
- `eligibility_input_ref` 必须可用于追溯“为什么发证/不发证”（v1 至少对 available 状态要求）。

---

### 4.9 `ThreadCreated` (schema_version = 1.0)

```yaml
thread_id: string
course_run: CourseRunRef
user: UserRef
thread_type: string              # "discussion" | "question"（允许扩展）
visibility_ref: string|null      # 讨论可见性规则引用（语义）
created_at: string|null
```

---

### 4.10 `CommentCreated` (schema_version = 1.0)

```yaml
comment_id: string
thread_id: string
course_run: CourseRunRef
user: UserRef
created_at: string|null
```

---

### 4.11 `NotificationSent` (schema_version = 1.0)

```yaml
notification_id: string
user: UserRef
channel: string                  # "web" | "email" | "push"（允许扩展；v1 仅 web）
delivery_state: string           # "sent" | "failed" | "skipped"（允许扩展）
notification_type: string|null   # "grade" | "certificate" | "discussion" 等（语义）
related_ref: string|null         # 指向触发对象（thread_id/certificate_id 等）
sent_at: string|null
```

**不变量**
- `delivery_state=skipped` 需要可解释（通常是用户偏好/合规策略导致）。

---

### 4.12 `ExportJobCreated` (schema_version = 1.0)

```yaml
job_id: string
course_run: CourseRunRef
requested_by:
  user_id: string
report_type: string              # "grades" | "submissions" | "progress"（允许扩展）
filters: object|null             # 语义过滤（不规定结构；但必须可序列化以便审计）
created_at: string|null
```

---

### 4.13 `ExportJobCompleted` (schema_version = 1.0)

```yaml
job_id: string
course_run: CourseRunRef
state: string                    # "completed" | "failed"
result: ResultRef|null
error:
  code: string|null
  message: string|null
completed_at: string|null
```

**不变量**
- `state=completed` 时必须有 `result`。
- `state=failed` 时必须有 `error.code`。

---

## 5. 消费者要求（Consumer Requirements）

- 必须支持事件去重：按 `event_id` 幂等处理。
- 必须对未知字段与未知枚举值“容忍并忽略/降级处理”。
- 必须把 `correlation_id`/`causation_id` 贯穿到日志与追踪（语义），以支持跨域排障。

---

*文档版本：1.0*
*v1 事件 schema（用于第二步新实现设计）*
