# NeoEdx v1 数据所有权与关键标识（Data Ownership & Keys）

> 目的：为 v1 冻结“各域拥有什么数据、用什么标识、如何跨域引用”，避免隐式共享数据导致边界漂移。  
> 范围：仅覆盖 v1 In-scope 领域（见 `neoEdx/06_v1_Scope_and_MVP.md`、`neoEdx/07_Domain_Contracts_v1.md`）。  
> 原则：技术无关；只定义语义与不变量，不规定数据库/协议/格式。

## 1. 总原则（必须遵守）

1. **Owner Domain 唯一真值**：核心状态只能由拥有域写入；其他域只能读公开视图或消费事件投影。
2. **引用而非复制**：跨域传播优先传递“引用（ref）”而非复制对象全文；复制属于“投影”，必须声明延迟与一致性语义。
3. **可追溯**：涉及权益、成绩、证书的状态变化必须能追溯到输入引用与操作者/原因（语义）。
4. **PII 最小化**：跨域载荷不传播 PII；使用 `user_id` 等抽象标识，PII 仅由 Identity 拥有并通过受控查询暴露最小字段。

## 2. v1 领域与数据所有权（Owner Data Map）

| Domain | Owner data（真值） | 典型跨域只读视图（可公开） |
|--------|---------------------|----------------------------|
| Identity | 账户、认证状态、用户资料（PII）、角色授予 | `PublicUserProfile`（最小字段）、`PermissionDecision` |
| Course | 课程 run 生命周期、关键日期、能力开关、策略引用（policy refs） | `CourseRunPublic`（标题/日期/状态/refs） |
| Content | 结构树、内容块、发布版本 | `LearningSequenceView`（学习视图）、`ContentForGradingView` |
| Catalog | 目录条目、类目/集合、可见性规则（目录语义） | `CatalogSearchResult`、`CatalogEntryDetail` |
| Commerce | 订单、支付状态、收据引用 | `PriceAndOfferView`（展示用） |
| Enrollment | 报名状态、报名模式、权益状态与追溯信息 | `AccessDecision`、`EnrollmentSummary` |
| Grades | 提交、评分、成绩汇总、成绩留痕 | `GradeSummaryView`、`SubmissionView`、`EligibilityInputRef` |
| Certificates | 证书记录、证书状态、验证引用 | `CertificatePublicView`、`VerificationResult` |
| Discussion | 帖子、回复、可见性状态 | `ThreadListView`、`ThreadDetailView` |
| Notifications | 通知记录、投递状态、用户偏好 | `NotificationListView`、`PreferenceView` |
| Reporting | 导出任务、报表定义（最小）、导出结果引用 | `ProgressDashboardView`、`ExportJobView` |
| Platform | 站点级配置、集成配置引用、全局开关语义 | `SiteConfigView`（脱敏） |

## 3. 标识与引用的分类

### 3.1 ID（identifier）

- 表示“某域拥有的实体”的稳定标识。
- 只能由拥有域生成并保证唯一性（实现方式不限）。
- 任何跨域载荷使用 ID 时，必须同时指明其所属域（或通过字段名体现）。

### 3.2 Ref（reference）

Ref 用于跨域引用与追溯，分两类：

- **Entity Ref**：指向某个实体（例如 `course_run_id`、`order_id`）。
- **Snapshot/Policy Ref**：指向“某一时刻/某一版本”的输入（例如 `content_snapshot_ref`、`policy_refs`）。

Ref 必须满足：

- 可被拥有域解析为明确对象/版本/策略
- 可用于审计追溯（至少包含创建时间与关联对象语义）

## 4. v1 关键标识目录（Key Catalog）

> 下表定义 v1 必须统一的标识语义；字段名可在实现时微调，但语义不得变。

### 4.1 Identity

| Key | Owner | 含义 | 不变量 |
|-----|-------|------|--------|
| `user_id` | Identity | 平台用户标识（非 PII） | 全局唯一、不可复用 |
| `session_ref` | Identity | 认证会话引用（语义） | 可过期/可撤销（策略在第二步定） |

### 4.2 Course / Catalog

| Key | Owner | 含义 | 不变量 |
|-----|-------|------|--------|
| `course_id` | Course | 课程“定义”标识（不含 run） | 全局唯一（语义），可被多个 run 复用 |
| `course_run_id` | Course | 某次开课（run/term）标识 | 一个 run 对应一套报名/学习/成绩/证书语义 |
| `catalog_entry_id` | Catalog | 目录条目标识（发现视图实体） | 必须可追溯到 `course_run_id` 或 program 等来源 |

### 4.3 Content

| Key | Owner | 含义 | 不变量 |
|-----|-------|------|--------|
| `content_block_id` | Content | 内容块标识 | 在同一 `course_run_id` 语义下唯一 |
| `content_ref` | Content | 对“学习/评分对象”的引用（例如单元/题目） | 可解析到一个稳定对象 |
| `content_version_id` | Content | 发布版本标识 | 单调递增或可比较（语义），可追溯 |
| `content_snapshot_ref` | Content（创建）/Grades（引用） | 提交/评分时使用的内容快照引用 | 必须可复现评分输入；同一提交固定不变 |

> `content_snapshot_ref` 的最小语义：能解析到（课程 run、内容引用、发布版本/快照时间、关键配置摘要）。

### 4.4 Commerce / Enrollment

| Key | Owner | 含义 | 不变量 |
|-----|-------|------|--------|
| `order_id` | Commerce | 订单标识 | 全局唯一；支付确认幂等 |
| `sku_ref` | Commerce | 商品引用（课程席位/权益） | 必须能映射到 `course_run_id` 与权益类型 |
| `enrollment_id` | Enrollment | 报名记录标识 | 对应（`user_id`,`course_run_id`）的某次报名状态变更链路 |
| `entitlement_ref` | Enrollment | 权益引用（影响访问/证书资格） | 必须可追溯到 `order_id`（若为付费） |
| `course_mode` | Enrollment | 报名模式（audit/paid 等语义） | 模式决定访问/证书资格的语义输入之一 |

### 4.5 Grades / Certificates

| Key | Owner | 含义 | 不变量 |
|-----|-------|------|--------|
| `submission_id` | Grades | 一次提交记录标识 | 关联唯一的 `content_snapshot_ref` |
| `grade_ref` | Grades | 成绩引用（可指向小节/课程汇总） | 可追溯到计算输入与时间 |
| `eligibility_input_ref` | Grades（生成） | 证书资格判定输入的稳定引用 | 必须可复现；供 Certificates 使用 |
| `certificate_id` | Certificates | 证书记录标识 | 对（`user_id`,`course_run_id`）至多一个“有效证书记录”（可有历史） |
| `verify_ref` | Certificates | 对外验证引用（公开） | 不泄露 PII；可被第三方稳定验证 |

> `eligibility_input_ref` 建议包含（语义）：`course_run_id`、`user_id`、`course_mode`、`entitlement_state`、`grade_summary`、`policy_refs_hash`、`generated_at`。

### 4.6 Discussion / Notifications / Reporting

| Key | Owner | 含义 | 不变量 |
|-----|-------|------|--------|
| `thread_id` | Discussion | 讨论帖标识 | 归属 `course_run_id` |
| `comment_id` | Discussion | 回复标识 | 归属 `thread_id` |
| `notification_id` | Notifications | 通知记录标识 | 支持幂等投递/重试语义 |
| `export_job_id` | Reporting | 导出任务标识 | 结果引用必须可追溯到发起者与范围 |
| `result_ref` | Reporting | 导出结果引用（文件/链接语义） | 有效期/访问控制语义由 Platform/Reporting 决定 |

## 5. 策略引用（Policy Refs）标准

> Course 不直接拥有其他域的策略细节；它只维护“引用关系”，以消除配置所有权冲突（见 `neoEdx/04_ADR.md`、`neoEdx/07_Domain_Contracts_v1.md`）。

### 5.1 `policy_refs`（CourseRun 的策略引用集合）

最小包含（语义字段）：

- `grading_policy_ref`（Grades 拥有其解释权）
- `certificate_policy_ref`（Certificates 拥有其解释权）
- `catalog_visibility_ref`（Catalog 拥有其解释权）
- `enrollment_window_ref`（Enrollment 拥有其解释权）
- `discussion_policy_ref`（Discussion 拥有其解释权）
- `progress_policy_ref`（Content/Reporting 拥有其解释权；完成度口径与阈值）

> v1 若某策略不启用，可为 `null` 或缺省，但需要明示“未启用”的语义（避免消费者猜测）。

### 5.2 策略引用的版本化

- 任一策略引用变更应导致 `CourseUpdated`（含 `policy_refs` 变更摘要）。
- `eligibility_input_ref` 必须绑定一个可追溯的策略引用版本摘要（例如 `policy_refs_hash` 的语义）。

> v1 默认通过线由 `grading_policy_ref` 指定为 70%（可在 v1+ 扩展为更复杂策略）。

## 6. 跨域数据共享规则（Sharing Rules）

### 6.1 允许跨域直接读取的最小字段

- `user_id`、`course_run_id` 等抽象标识
- 不含 PII 的展示字段（由各域公开视图定义）
- 追溯字段：`order_id`、`entitlement_ref`、`content_snapshot_ref`、`eligibility_input_ref`

### 6.2 禁止跨域传播的字段（v1）

- 邮箱、手机号、真实姓名、身份证明材料等 PII（除非明确的受控接口且脱敏/最小化）
- 支付敏感信息（卡号、token 等）
- 监考证据等高敏感内容（v1 不在范围内）

### 6.3 投影（Projection）要求

若某域为了性能维护跨域投影，必须在文档中明确：

- 投影来源（事件/查询）
- 延迟预期（例如秒级/分钟级语义）
- 回源策略（投影缺失/过期时如何处理）
- 失败补偿（事件重放/重建语义）

## 7. 关键不变量清单（v1 必须满足）

- （可见性）Catalog 返回结果必须满足调用者可见性规则，不可泄露隐藏课程。
- （资格）Content/Discussion/Grades 的“访问许可”必须可由 Enrollment 的公开判定解释。
- （可复现）每个 `submission_id` 必须绑定不可变的 `content_snapshot_ref`。
- （证书追溯）每个 `certificate_id` 必须能追溯到 `eligibility_input_ref`。
- （权益追溯）付费权益变更必须能追溯到 `order_id`（或明确的“非订单来源”）。

---

*文档版本：1.0*
*v1 数据所有权与关键标识（用于第二步新实现设计）*
