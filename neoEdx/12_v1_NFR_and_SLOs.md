# NeoEdx v1 非功能需求与 SLO（NFR & SLOs）

> 目的：为 v1 固化“可测量”的非功能需求（NFR）与服务级目标（SLO），作为第二步（新实现设计）与后续验收的共同标准。  
> 范围：v1 MVP（见 `neoEdx/06_v1_Scope_and_MVP.md`），并与领域契约/事件契约对齐（见 `neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/09_v1_Event_Schemas.md`）。

## 1. 总体原则

- SLO 必须可观测、可测量、可归因（能定位到领域/能力/链路）。
- v1 以“可交付闭环”为第一优先级；指标以保守目标为主，避免过度承诺。
- 跨域协作默认最终一致（见 `neoEdx/07_Domain_Contracts_v1.md`），因此必须明确“延迟预期”。

## 2. 关键用户旅程（用于 SLO 口径）

v1 关键旅程（抽样监控/告警口径）：

- T1：搜索课程 → 查看详情（Catalog）
- T2：注册 → 邮箱验证 → 登录（Identity）
- T3：免费报名 / 付费购买 → 权益生效（Commerce + Enrollment）
- T4：进入学习序列 → 获取单元内容 → 记录进度（Content）
- T5：提交 → 自动/手动评分 → 查看成绩（Grades）
- T6：达标 → 证书生成 → 下载/验证（Certificates）
- T7：发帖/回复 → 通知触达（Discussion + Notifications）
- T8：教师进度看板 → 导出报表（Reporting）

## 3. 可用性与可靠性（Availability & Reliability）

### 3.1 可用性目标（SLO）

| 组件/旅程 | SLO（v1 建议） | 备注 |
|----------|----------------|------|
| 学习端核心 API（T1/T3/T4/T5/T6/T7） | 99.9% 月可用性 | 以用户可感知错误率为准 |
| 创作端发布链路（T2/T9） | 99.5% 月可用性 | v1 可略低于学习端 |
| 证书生成（近实时；实现可异步） | 99% 成功率 | “成功率”按任务最终完成计 |
| 报表导出（异步） | 99% 成功率 | 失败可重试 |

### 3.2 可靠性要求（NFR）

- 所有跨域命令必须幂等（`idempotency_key`），可安全重试。
- 所有事件消费者必须按 `event_id` 幂等处理（可重复投递）。
- 允许事件乱序：消费者必须能容忍并采取延迟/重试策略（见 `neoEdx/10_v1_State_Machines.md`）。

## 4. 性能（Latency/Throughput）

### 4.1 交互式请求延迟 SLO（P95）

| 场景 | SLO（P95） |
|------|------------|
| 搜索/列表（Catalog） | ≤ 800ms |
| 课程详情（Catalog） | ≤ 500ms |
| 免费报名（Enrollment） | ≤ 800ms |
| 创建订单（Commerce） | ≤ 800ms |
| 学习序列/单元内容（Content） | ≤ 700ms |
| 提交（Grades） | ≤ 1000ms（提交成功响应） |
| 查看成绩（Grades） | ≤ 700ms |
| 证书查询（Certificates） | ≤ 700ms |
| 证书验证（公开接口） | ≤ 300ms |
| 讨论列表/详情（Discussion） | ≤ 700ms |
| 发帖/回复（Discussion） | ≤ 900ms |
| 通知列表（Notifications） | ≤ 700ms |
| 教师进度看板（Reporting） | ≤ 1200ms |

> 说明：这些是 v1 建议目标；第二步可按真实规模与成本再调整。

### 4.2 吞吐与容量（NFR）

- v1 必须支持“峰值报名/提交”场景的突发流量；对于长耗时操作必须异步化（证书生成、导出）。
- 支持横向扩展（语义）：无状态/可拆分的能力应可按热点扩容（不要求微服务）。

## 5. 一致性与延迟预期（Consistency & Freshness）

### 5.1 跨域最终一致窗口（SLO）

| 联动 | SLO（最终一致窗口） |
|------|----------------------|
| 支付成功 → 权益生效（OrderPaid → EnrollmentChanged） | ≤ 60s |
| 成绩变更 → 证书状态更新（GradeChanged → CertificateStateChanged） | ≤ 60s |
| 讨论回复 → 通知生成/投递（CommentCreated → NotificationSent） | ≤ 2min |
| 导出任务创建 → 可下载（ExportJobCreated → ExportJobCompleted） | ≤ 15min（视数据量） |

### 5.2 新鲜度口径（NFR）

- Reporting 看板允许分钟级延迟（如果通过投影实现），但必须显示“数据更新时间”（语义）。
- Catalog 的可见性变更应在可接受时间内生效（v1 可设为 ≤ 10min）。

## 6. 安全（Security）

### 6.1 基础安全要求（NFR）

- 全链路加密传输（语义要求）。
- 认证与授权：必须区分学习者/课程内教学角色/管理员权限范围（语义）。
- 防滥用：对注册、登录、密码重置、搜索等接口具备基本限流与风控策略（v1 最小）。

### 6.2 数据安全

- 密码等敏感凭证必须以安全方式存储（不规定具体算法，但必须满足业界最佳实践）。
- 支付敏感数据不进入业务事件与日志（见 `neoEdx/09_v1_Event_Schemas.md`）。

## 7. 隐私与合规（Privacy & Compliance）

v1 最小要求：

- 事件与日志不携带 PII；跨域只用 `user_id` 与受控公开视图（见 `neoEdx/08_v1_Data_Ownership_and_Keys.md`）。
- 对“用户数据导出/删除/匿名化”的合规能力在 v1 中不强制，但必须预留：
  - 数据归属清单（本文件 + 08）
  - 可执行路径的设计占位（Support/Platform 的 v1+ 规划）

## 8. 可观测性（Observability）

### 8.1 指标（Metrics）

必须采集并按领域分桶：

- 请求量、错误率、P95 延迟（按 API/use case）
- 事件处理滞后（event lag）、事件失败与重试次数
- 异步任务成功率与耗时（证书生成、导出）

### 8.2 日志与追踪（Tracing）

- 所有关键链路必须记录 `correlation_id`，并在事件信封中传播（语义）。
- 对跨域流程（T3/T5/T6/T8）必须能串联出端到端追踪（不限定工具）。

## 9. 审计与可追溯（Auditability）

v1 必须可追溯的动作（最小）：

- 手动评分/成绩覆盖：操作者、时间、原因/反馈（见 `neoEdx/10_v1_State_Machines.md`）
- 付费权益生效：能从 Enrollment 追溯到 `order_id`
- 证书生成：能追溯到 `eligibility_input_ref`

> v1 不要求完整的审计查询 UI，但必须保证数据可被查询/导出（语义）。

## 10. 备份与恢复（Backup & Recovery）

v1 最小要求（语义）：

- 支持对核心业务数据的备份与恢复演练（至少：Enrollment、Grades、Certificates、Commerce）。
- RPO/RTO 建议（可在第二步定具体值）：
  - RPO ≤ 24h（v1 起步）
  - RTO ≤ 4h（v1 起步）

## 11. 变更管理（Change Management）

- Schema 演进：事件 schema 只能向后兼容（见 `neoEdx/09_v1_Event_Schemas.md`）。
- 关键策略引用（`policy_refs`）变更必须通过 `CourseUpdated` 可追溯（见 `neoEdx/08_v1_Data_Ownership_and_Keys.md`）。

---

*文档版本：1.0*
*v1 NFR & SLO（用于第二步新实现设计与验收）*
