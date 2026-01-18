# NeoEdx v1 代码库结构与约束（Codebase Structure）

> 目的：为 v1（Java + Spring 模块化单体）提供可执行的代码组织方案与约束，确保领域边界落地、便于迭代与未来拆分。  
> 前提：K8s + PostgreSQL + 不引入外部队列（见 `neoEdx/14_v1_Deployment_and_Runtime_Constraints.md`、`neoEdx/15_v1_Technology_Stack_ADR.md`）。  
> 边界与契约：`neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/08_v1_Data_Ownership_and_Keys.md`、`neoEdx/09_v1_Event_Schemas.md`、`neoEdx/10_v1_State_Machines.md`、`neoEdx/16_v1_Spring_Modular_Monolith_Implementation_Guidelines.md`。

## 1. 仓库结构（建议：单仓 + 多 Gradle/Maven 模块）

> 不强制使用 Gradle 或 Maven，但建议“一个模块 = 一个领域边界”，并在构建层面做依赖约束。

```
neoedx/
  build.gradle(.kts) / pom.xml
  settings.gradle(.kts)             # 声明子模块
  apps/
    api/                            # 对外 API 入口（组合各领域 public APIs）
  libs/
    common/                         # 跨域共享：只放“真正通用”的无业务语义代码
    contracts/                      # 事件 envelope/types、错误码、idempotency/correlation 工具（语义）
  domains/
    identity/
    course/
    content/
    catalog/
    commerce/
    enrollment/
    grades/
    certificates/
    discussion/
    notifications/
    reporting/
    platform/
  infra/
    db/                             # 数据库迁移与初始化（见第 3 节）
    runtime/                        # K8s manifests / helm values（语义；如需要可拆出单独 repo）
```

### 1.1 模块依赖方向（强制）

- `apps/api` 只能依赖：`domains/*` 的 `public` API + `libs/*`
- `domains/X` 只能依赖：`libs/*` +（可选）其他 `domains/*` 的 `public` API
- 禁止：`domains/X` 依赖 `domains/Y` 的 `infra`/`db`/内部包

## 2. 领域模块内部结构（统一约定）

每个 `domains/<domain>` 模块采用一致布局：

```
domains/<domain>/src/main/java/.../<domain>/
  api/                 # controller + request/response DTO（仅输入输出与鉴权前置）
  application/
    public/            # 对外公开的 commands/queries（跨域唯一入口）
    internal/          # 本域用例编排（handlers/use cases）
  domain/              # 领域模型、状态机、不变量（纯业务语义）
  infra/
    persistence/       # repository、entity mapping、DAO（仅本域可用）
    integration/       # 外部系统适配（支付/对象存储/邮件等；v1 尽量少）
    events/            # outbox 写入、事件发布适配（仅本域生成自己的事件）
```

> 领域事件 schema 以 `neoEdx/09_v1_Event_Schemas.md` 为准；跨域传播使用 envelope。

## 3. 数据库结构与迁移（PostgreSQL 单库多 schema）

### 3.1 schema 命名

每个领域一个 schema（Owner 数据只落本 schema）：

- `identity`, `course`, `content`, `catalog`, `commerce`, `enrollment`, `grades`, `certificates`, `discussion`, `notifications`, `reporting`, `platform`

通用基础设施 schema（语义）：

- `infra`：outbox、任务表、幂等键、审计（如果不归属某单域）

> 如果 outbox/job 明确由某域拥有（例如 reporting.export_job），可以落到该域 schema；但需保持“一处真值”。

### 3.2 迁移文件组织

建议按 schema 分目录（Flyway/Liquibase 任选其一）：

```
infra/db/
  identity/
  course/
  content/
  ...
  infra/
```

命名建议（Flyway 示例语义）：`V{yyyymmddHHMM}_{domain}_{desc}.sql`

### 3.3 v1 最小表：Outbox（推荐）

**位置**：`infra.outbox`（或各域 schema 的 `<domain>.outbox`）

最小字段（语义）：

- `event_id`（PK，全局唯一）
- `event_type`
- `schema_version`
- `producer_domain`
- `occurred_at`
- `correlation_id`
- `causation_id`（nullable）
- `partition_key`（nullable，建议 course_run_id 或 user_id）
- `payload_json`（事件体）
- `state`：`pending` / `published` / `failed`
- `attempts`、`next_retry_at`、`last_error`
- `created_at`、`updated_at`

不变量：

- 业务事务内必须“业务写 + outbox 写”同一事务语义。
- 发布器按 `event_id` 幂等发布；可重复扫描与重放。

### 3.4 v1 最小表：Job（证书生成/导出）

**位置建议**：
- `reporting.export_job`（导出任务归 Reporting）
- `certificates.certificate_job`（证书生成任务归 Certificates，若需要异步）

最小字段（语义）：

- `job_id`（PK）
- `job_type`（`export`/`certificate_issue`）
- `state`：`created`/`running`/`completed`/`failed`（见 `neoEdx/10_v1_State_Machines.md`）
- `requested_by_user_id`
- `course_run_id`
- `input_json`（filters/eligibility_input_ref 等）
- `result_ref`（nullable）
- `error_code`、`error_message`（nullable）
- `attempts`、`next_retry_at`
- `correlation_id`
- `created_at`、`updated_at`

并发语义（多副本）：

- 同一 `job_id` 同一时刻只能被一个执行器处理（用 DB 锁/租约实现）。
- 执行器必须支持重试与幂等。

### 3.5 v1 最小表：Idempotency（强制）

**位置**：`infra.idempotency_key`（或落到各域 schema）

最小字段（语义）：

- `idempotency_key`（PK）
- `scope`（例如 `Enroll`, `CreateOrder`, `SubmitAttempt`）
- `actor_user_id`
- `request_hash`
- `response_json`（或 `result_ref`）
- `created_at`, `expires_at`

> 所有写 API/command 必须检查并写入 idempotency 记录，确保客户端重试安全。

## 4. API 与鉴权落地（Spring）

### 4.1 Controller 放置

- 仅在 `apps/api` 或各域 `api/` 中存在 Controller（推荐集中到 `apps/api` 统一路由与鉴权）。
- Controller 只做：校验、鉴权前置、调用 `application/public`。

### 4.2 权限判定入口

- “访问许可”（学习/讨论/提交）统一通过 Enrollment 的 `CheckAccess` 语义判断（见 `neoEdx/07_Domain_Contracts_v1.md`）。
- 教学角色（评分/导出）通过 Identity 的课程内角色语义判定。

## 5. 事件与应用内发布（Spring）

### 5.1 事件生成

- 各域在完成状态迁移后写 outbox；发布器读取 outbox 并发布应用内事件（或直接触发同进程消费者）。
- 消费者必须按 `event_id` 幂等处理（见 `neoEdx/09_v1_Event_Schemas.md`）。

### 5.2 禁止“直接调用消费者”

- 例如：Grades 不得直接调用 Certificates 的内部实现；只能：
  - 发 `GradeChanged`（事件），由 Certificates 消费
  - 或调用 Certificates 的 `application/public`（命令）——但 v1 优先事件

## 6. 可观测性（强制字段）

所有入口与后台执行必须记录/传播：

- `correlation_id`（贯穿请求 → outbox → 消费 → job）
- `user_id`（若有）
- `course_run_id`（若有）

并按用例/领域打点指标（见 `neoEdx/12_v1_NFR_and_SLOs.md`）。

## 7. 代码门禁（建议）

必须具备至少一种门禁方式来保证模块边界：

- 构建层面：禁止非法模块依赖（Gradle/Maven module deps）
- 代码层面：架构测试（例如对包依赖进行扫描）禁止跨域访问 `infra/persistence`

---

*文档版本：1.0*
*v1 代码库结构与约束（用于实现阶段）*
