# NeoEdx v1 Spring 模块化单体落地约束（Implementation Guidelines）

> 目的：把“模块化单体 + 领域边界”在 Spring 体系内工程化落地，避免退化为巨石单体。  
> 范围：v1 MVP（见 `neoEdx/06_v1_Scope_and_MVP.md`），契约与数据规则见 `neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/08_v1_Data_Ownership_and_Keys.md`、`neoEdx/09_v1_Event_Schemas.md`、`neoEdx/10_v1_State_Machines.md`。  
> v1 约束：K8s + PostgreSQL + 不引入外部队列（见 `neoEdx/14_v1_Deployment_and_Runtime_Constraints.md`、`neoEdx/15_v1_Technology_Stack_ADR.md`）。

## 1. 模块边界（强制）

### 1.1 模块划分

按领域边界组织为独立模块（建议包路径示例）：

- `identity`, `course`, `content`, `catalog`, `commerce`, `enrollment`, `grades`, `certificates`, `discussion`, `notifications`, `reporting`, `platform`

每个模块内部至少分 3 层（不要求 DDD 全套，但必须清晰）：

- `api`：对外适配层（controller/dto/mapper），只做输入输出与鉴权前置
- `application`：用例编排（commands/queries handlers），只调用本模块 domain + 其他模块的“公开接口”
- `domain`：领域模型与规则（状态机/不变量）
- `infra`：数据库/外部系统适配（repo、outbox、邮件/对象存储客户端等）

### 1.2 禁止的依赖

- 禁止跨模块直接访问对方的 `infra`/数据库实体/Repository。
- 禁止跨模块直接读取对方内部表结构（即使同一个 Postgres 实例）。
- 禁止在 `domain` 层直接调用外部系统（必须由 application/infra 适配）。

### 1.3 允许的跨模块交互

仅允许两类：

- **公开 Query**：读取对方的公开视图（只读）
- **公开 Command**：请求对方变更其拥有状态（写）

这些接口应集中定义在每个模块的 `application/public`（或等价命名）包内。

## 2. 数据隔离（PostgreSQL 单库多 schema）

### 2.1 schema 约定

建议每个模块一个 schema，例如：

- `identity.*`, `course.*`, `content.*`, ...

### 2.2 访问控制（工程化门禁）

- Repository 只能访问本 schema。
- 若使用 ORM，实体映射必须带 schema，防止“误连表”。
- 跨域聚合查询一律放在 Reporting 模块（且只读），并明确口径与延迟语义。

## 3. 事件与 Outbox（v1 推荐落地）

### 3.1 事件生成原则

- 事件 schema 以 `neoEdx/09_v1_Event_Schemas.md` 为准。
- 事件由 Owner Domain 产生：状态变更完成后再发布事实事件。
- 所有事件必须包含 `correlation_id`，并在日志中贯穿。

### 3.2 Outbox 语义（不引入外部 MQ）

v1 建议实现“Outbox 表 + 发布器”：

- 业务事务内：写业务数据 + 写 outbox 记录（同一事务语义）
- 后台发布器：轮询/监听 outbox，将事件投递到“应用内事件总线”，并标记已投递

> 这样既满足幂等与可追溯，也为未来接入 Kafka/RabbitMQ 提供平滑迁移路径。

## 4. 异步任务（不引入外部队列）

### 4.1 任务表模型（推荐）

对下列异步能力采用任务表 + 执行器：

- 证书生成（Certificates）
- 报表导出（Reporting）

任务表必须包含（语义字段）：

- `job_id`, `job_type`, `state`（见 `neoEdx/10_v1_State_Machines.md`）
- `requested_by`, `course_run_id`
- `attempts`, `next_retry_at`, `last_error_code`
- `correlation_id`

### 4.2 执行器要求

- 多副本部署下，任务“只被一个执行器消费”（语义；用 DB 锁/租约等实现）
- 幂等：同一 `job_id` 重试不产生重复副作用
- 可观测：成功率、耗时、积压量（见 `neoEdx/12_v1_NFR_and_SLOs.md`）

## 5. 安全与权限（Spring Security 建议落地）

### 5.1 v1 登录规则

- 邮箱验证后才允许登录（见 `neoEdx/13_v1_Open_Questions_and_Assumptions.md`）。

### 5.2 权限模型（语义）

最小实现即可，但必须覆盖：

- 学习者权限（学习/提交/讨论）：以 Enrollment 的访问判定为前置
- 课程 staff 权限（评分/导出）：Identity 输出的课程内角色语义
- 管理员权限（站点配置/目录运营）：Platform/Identity 范围控制

## 6. 可观测性（强制）

- 结构化日志：包含 `correlation_id`、`user_id`（若有）、`course_run_id`（若有）
- 指标：请求/错误/延迟（P95），任务成功率/耗时，事件 lag
- 追踪：在同一单体内也保持 trace/span 语义，为未来拆分做准备

## 7. 测试门禁（建议）

- 模块边界测试：验证“禁止依赖”规则（可用架构测试/依赖扫描）
- 契约测试：对事件 schema 与关键不变量（70% 通过线、snapshot/eligibility ref）做单元测试
- 端到端旅程测试：覆盖 v1 DoD 闭环（见 `neoEdx/06_v1_Scope_and_MVP.md`）

---

*文档版本：1.0*
*Spring 模块化单体落地约束（用于第二步新实现设计与实现阶段）*
