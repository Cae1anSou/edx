# NeoEdx v1 技术栈 ADR（Technology Stack ADR）

> 目的：在 v1“模块化单体”前提下，做可追溯的技术栈选择，并明确哪些是 v1 必选、哪些可延后。  
> 约束来源：`neoEdx/14_v1_Deployment_and_Runtime_Constraints.md`、`neoEdx/12_v1_NFR_and_SLOs.md`、`neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/09_v1_Event_Schemas.md`。  
> 说明：本文件允许在落地过程中迭代更新；任何重大变更需新增 ADR 条目而非直接改写历史。

## ADR-TS-001：v1 采用模块化单体（Modular Monolith）落地领域边界

### 上下文

v1 目标是快速交付学习闭环，并验证领域边界与关键契约（事件/标识/状态机）。微服务拆分会引入过高的分布式复杂度与运维负担。

### 决策

v1 采用模块化单体：单部署单元 + 领域模块化 + 明确的 commands/queries/events 边界。

### Alternatives considered

- 微服务优先
- 单体但无明确边界（按技术分层/按页面组织）

### Consequences

- 正面：交付快、调试简单、边界能被强约束（代码层面）
- 负面：需要在代码组织/依赖规则/测试策略上“强制模块边界”

### 状态

Accepted

---

## ADR-TS-002：数据库选型（v1 主存储）

### 上下文

v1 需要可靠事务、可追溯数据、查询/导出能力，并且领域数据即使在同一物理库也要保持逻辑隔离。

### 决策（建议）

采用 PostgreSQL 作为 v1 主存储，并以 schema/命名空间方式按领域隔离。

### Alternatives considered

- 关系型数据库（PostgreSQL/MySQL 等）
- 文档数据库（MongoDB 等）

### Consequences

- 正面：事务、约束、导出/报表天然友好；利于审计
- 负面：需要对“内容块 JSON”等灵活结构做好边界与索引策略（实现阶段细化）

### 状态

Accepted

---

## ADR-TS-003：异步任务与队列（证书生成/报表导出）

### 上下文

v1 虽然追求“近实时触发”，但证书生成与导出任务天然适合异步执行，且需要可观测的任务状态机（见 `neoEdx/10_v1_State_Machines.md`）。

### 决策（建议）

v1 不引入外部队列/消息中间件；采用“应用内后台执行 + 数据库任务表”的方式落地异步 job 模型（证书生成、导出任务），并允许在负载较小时“同步触发 + 异步执行”。

### Alternatives considered

- 引入外部队列/worker（RabbitMQ/Kafka/Celery 等）
- 纯同步执行（所有任务都在请求内完成）
- 仅定时批处理（低实时性）

### Consequences

- 正面：减少基础设施依赖；仍能满足 v1 的异步与状态机语义
- 负面：需要定义“任务表 + 执行器”的并发与恢复语义；后续迁移外部队列需做兼容层

### 状态

Accepted（v1 约束）

---

## ADR-TS-004：事件机制（进程内事件 + 可持久化 outbox）

### 上下文

v1 需要领域事件以解耦模块，并为未来服务拆分保留演进路径；事件 schema 已在 `neoEdx/09_v1_Event_Schemas.md` 固化。

### 决策（建议）

- v1 使用进程内事件总线（同步/异步由实现决定）
- 对关键事件引入 outbox 语义（事件持久化 + 可重放），以支持：
  - 审计追溯
  - 异步消费者（如通知、证书、报表投影）
  - 未来迁移到外部消息系统

### Alternatives considered

- 直接引入外部消息系统（Kafka/RabbitMQ 等）作为 v1 前置
- 仅进程内事件且不持久化

### Consequences

- 正面：兼顾简单与可演进；为拆分服务提供桥梁
- 负面：需要定义 outbox 的一致性语义与重放策略（实现阶段）

### 状态

Accepted（v1：进程内事件；Outbox 语义建议实现）

---

## ADR-TS-005：后端语言与 Web 框架（v1）

### 上下文

v1 需要：
- 快速交付（开发效率）
- 模块边界约束（可维护）
- 良好的生态（认证、任务队列、ORM、测试、可观测）
- 未来可拆分/可演进

### 决策

v1 后端采用 Java + Spring 生态（“Spring 全家桶”）作为模块化单体落地方案。

建议组件（可在实现阶段细化版本与具体组合）：

- Spring Boot（应用框架与运行）
- Spring Web（对外 API）
- Spring Security（认证/授权语义落地）
- Spring Data（数据访问抽象；具体 ORM/SQL 方案实现阶段定）
- 数据库迁移工具（Flyway 或 Liquibase）
- Micrometer（指标）+ OpenTelemetry（追踪语义）+ 结构化日志（包含 `correlation_id`）
- （可选）Spring Modulith：用于“模块边界 + 应用内事件”约束与可视化

### Alternatives considered（示例）

- JVM（Kotlin/Java + Spring Boot）：成熟生态、模块化能力强、可观测与并发强
- Go（Go + 常用 Web 框架）：性能与部署简洁，但需要较多工程化约束来维持领域边界
- TypeScript（Node.js + NestJS）：开发效率高，适合模块化，但需关注 CPU 重任务与一致性约束
- Python（FastAPI 等）：开发效率高，但需要确保模块化边界与性能/SLO 可达

### Consequences

- 正面：利于模块边界强约束；生态成熟；可观测与运维工具链完善；与 v1 的“模块化单体 + 无外部队列”兼容
- 负面：需要对模块依赖与领域边界做工程化门禁（否则容易退化为“巨石单体”）

### 状态

Accepted

---

## ADR-TS-006：前端形态（v1）

### 上下文

v1 需要学习端、创作端、教学端、管理端的最小闭环。微前端/多仓会显著增加工程复杂度。

### 决策（建议）

v1 采用“单一前端代码库（或单一框架体系）+ 多应用路由分区”的形态，避免微前端作为前置条件。

### Alternatives considered

- 单体前端（模块化）
- 多应用（但同一技术栈/同一发布流水线）
- 微前端（v1+）

### Consequences

- 正面：开发与发布简单；一致的权限与导航体验
- 负面：需要规划模块边界与共享组件策略

### 状态

Proposed

---

## ADR-TS-010：运行平台（v1）

### 上下文

v1 运行平台偏好为 Kubernetes，需要支持无状态水平扩展、配置管理、可观测与灰度/回滚语义。

### 决策

v1 部署平台为 Kubernetes（K8s）。

### Alternatives considered

- VM/裸机部署
- PaaS 托管

### Consequences

- 正面：标准化部署与扩容；便于未来演进拆分
- 负面：需要最低限度的集群运维能力与发布规范

### 状态

Accepted

## ADR-TS-007：可观测性（Logs/Metrics/Tracing）

### 上下文

v1 的跨域最终一致窗口、异步任务成功率、事件 lag 都需要可观测才能验收（见 `neoEdx/12_v1_NFR_and_SLOs.md`）。

### 决策（建议）

v1 必须具备：

- 结构化日志（包含 `correlation_id`）
- 指标：请求/错误/延迟、任务成功率与耗时、事件 lag
- 分布式追踪语义（即使是单体，也要有 trace/span 语义，便于未来拆分）

### 状态

Accepted（语义层面）

---

## ADR-TS-008：通知渠道（v1）

### 上下文

`neoEdx/13_v1_Open_Questions_and_Assumptions.md` 已决策：v1 仅站内通知，邮件 v2。

### 决策

v1 仅实现站内通知（web channel）；事件与 schema 仍允许未来扩展 email/push（见 `neoEdx/09_v1_Event_Schemas.md`）。

### 状态

Accepted

---

## ADR-TS-009：第三方登录（v1）

### 上下文

`neoEdx/13_v1_Open_Questions_and_Assumptions.md` 已决策：v1 不做第三方登录，保留扩展点。

### 决策

v1 仅实现本地凭证登录 + 邮箱验证后登录；第三方登录作为 v2+。

### 状态

Accepted

---

## 附录：下一步需要你确认的“技术栈输入”

为完成 ADR-TS-006 的最终选择，请 CaelanSou 确认：

1. 前端形态偏好：单体前端 / 多应用同栈 / 微前端（v1+）

（确认后我可以把 ADR-TS-006 推进到 Accepted，并给出更具体的落地建议。）
