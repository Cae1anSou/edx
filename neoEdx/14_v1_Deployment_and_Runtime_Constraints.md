# NeoEdx v1 部署与运行约束（Deployment & Runtime Constraints）

> 决策前提：v1 采用“模块化单体（Modular Monolith）”优先，后续再考虑拆分服务。  
> 目的：给技术栈与落地架构设定边界条件（约束/非目标/必须项），避免选型拍脑袋。  
> 范围：v1 MVP（见 `neoEdx/06_v1_Scope_and_MVP.md`），与领域契约/事件/状态机/NFR 对齐（见 `neoEdx/07_Domain_Contracts_v1.md`、`neoEdx/09_v1_Event_Schemas.md`、`neoEdx/10_v1_State_Machines.md`、`neoEdx/12_v1_NFR_and_SLOs.md`）。

## 1. v1 部署形态（Architecture Shape）

### 1.1 目标形态：模块化单体

- 单个可部署单元（单进程/单应用）对外提供 API。
- 代码与数据按领域边界组织为模块（Identity/Course/Content/…），边界通过“模块内部 API（commands/queries/events）”约束，不允许跨模块直接读写内部状态。
- 跨领域协作优先使用进程内事件总线（语义），并为未来外部事件总线预留事件信封与 schema（见 `neoEdx/09_v1_Event_Schemas.md`）。

### 1.2 明确不做（v1）

- 不强制微服务拆分、不引入服务发现/网关体系作为前置条件。
- 不把“领域事件”实现成跨服务消息系统（可保留为进程内 + 可持久化 outbox 的语义）。

## 2. 运行环境假设（Runtime Assumptions）

> 若与你们目标环境不符，请在这里改掉并同步到 15 号技术栈 ADR。

- 运行方式：容器化部署（Docker 镜像）优先；运行平台为 Kubernetes（K8s）。
- 横向扩展：应用无状态，可多副本；状态存于外部数据存储（数据库/对象存储）。
- 静态资源与大文件（视频/证书/导出文件）：通过对象存储/CDN 语义分发。

## 3. 数据与状态（Data & State）

### 3.1 数据边界

- v1 仍要求“领域数据各自拥有”（见 `neoEdx/08_v1_Data_Ownership_and_Keys.md`），即使物理上在同一个数据库中，也必须做到 schema/table 逻辑隔离与访问隔离（通过代码与权限约束）。

### 3.2 关键引用与可追溯

- 必须支持：
  - `content_snapshot_ref`（提交/评分可复现）
  - `eligibility_input_ref`（证书资格可追溯）
  - `policy_refs`（Course 只维护引用关系）

## 4. 异步与事件（Async & Events）

- v1 不引入外部队列/消息中间件；异步能力通过“应用内后台执行 + 数据库任务表/Outbox（语义）”实现。
- v1 允许“近实时触发”以同步方式实现，但必须支持异步化演进（例如证书生成/导出任务）。
- 要求具备：
  - 任务状态可观测（见 `neoEdx/10_v1_State_Machines.md`）
  - 事件幂等去重（按 `event_id`）
  - 最终一致窗口（见 `neoEdx/12_v1_NFR_and_SLOs.md`）

## 5. 安全与合规（Security & Compliance）

- v1 强制：邮箱验证后才允许登录（见 `neoEdx/13_v1_Open_Questions_and_Assumptions.md`）。
- v1 强制：事件/日志不得携带 PII（见 `neoEdx/09_v1_Event_Schemas.md`）。
- v1 合规能力（导出/删除）不做，但必须保证后续可扩展：
  - 数据归属清单清晰
  - 关键对象可定位与可审计

## 6. 可观测性与运维（Observability & Ops）

### 6.1 必备观测能力（v1）

- 请求：按用例统计 QPS/错误率/P95（见 `neoEdx/11_v1_API_Surface.md`、`neoEdx/12_v1_NFR_and_SLOs.md`）
- 异步：证书生成、导出任务的成功率、耗时分布、队列积压（语义）
- 事件：消费者 lag、失败重试次数
- 追踪：`correlation_id` 贯穿请求与事件

### 6.2 备份与恢复

- 必须能对核心业务数据执行备份/恢复演练（语义）
- 起步 RPO/RTO 见 `neoEdx/12_v1_NFR_and_SLOs.md`

## 7. 发布与回滚（Release & Rollback）

- v1 必须支持：
  - 向后兼容的事件 schema 演进（`neoEdx/09_v1_Event_Schemas.md`）
  - 数据库变更可回滚/可前滚（语义）
  - 灰度发布（语义；具体方式在技术栈/平台阶段定）

---

*文档版本：1.0*
*v1 部署与运行约束（用于技术栈与落地架构设计）*
