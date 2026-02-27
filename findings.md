# Findings & Decisions

## Current Task (Kickoff Implementation)
- 用户要求按 `BACKEND_REFACTOR_PLAN.md` 开始实际重构，先完成分支与提交，然后持续推进。
- 已完成：
  - 分支 `refactor/backend-java-kickoff`
  - 基线文档提交（方案与规划文件）
  - Java 后端 Phase-0 工程骨架提交

## Requirements
- 用户要求基于当前项目检查后确定后端重写语言（Go 或 Java）。
- 需要给出可执行建议，而非泛化对比。

## Research Findings
- 仓库为大型 Open edX 风格 Django 单体，包含 `lms/`, `cms/`, `openedx/`, `xmodule/` 等核心域。
- `setup.py` 显示大量 Django app/plugin entry points 与课程能力扩展点。
- 已发现 Celery 作为后台任务框架被 `lms` 与 `cms` 明确集成。
- requirements 约束显示 Django/Celery 版本固定，说明生态依赖面较广。
- 量化证据（静态扫描）：
  - `djangoapps` 一级目录数量：`120`
  - 迁移目录：`73`；迁移文件：`576`
  - Celery 任务装饰器匹配：`260`
  - `signals.py` 文件：`31`
  - Django admin 注册匹配：`185`
  - modulestore/mongo 相关引用：`5507`
  - Django ORM 引用：`910`
  - DRF/APIView/ViewSet/Serializer 相关匹配：`4007`
- 环境与基础设施信号（`lms/envs` / `cms/envs` / `openedx/envs`）：
  - 同时使用 `DATABASES`、`CACHES`、Celery result backend。
  - 事件总线存在 Redis/Kafka 生产者配置。
  - AWS/S3 存储与邮件等配置面较大。
  - LMS 存在 Mongo 相关配置（如论坛、日志相关项）。
- 未发现现有 Go/Java 后端工程骨架（无 `go.mod`、`pom.xml`、`build.gradle`、`.go` 文件）。

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Continue deep static inspection before language recommendation | Need evidence-backed decision specific to this repo |
| Favor migration-risk-first criteria | Repository shows deep framework and ecosystem coupling |
| Recommend Java (Spring Boot ecosystem) over Go for full backend rewrite | Plugin-heavy architecture, large migration surface, async/event/ORM/admin/config complexity favor mature enterprise stack parity |
| Start migration with a standalone `backend-java` module | Minimize interference with existing Django runtime while enabling incremental rollout |
| Use "sample domain first" (notification preference) | Establish reusable migration pattern for subsequent domains |

### Go vs Java Weighted Scoring (repo-specific)
| Criterion (weight) | Go | Java | Why it matters here |
|---|---:|---:|---|
| Framework/ecosystem parity for large monolith migration (30) | 6 | 9 | 120 djangoapps, 576 migrations, many extension points |
| Complex domain modeling + maintainability at scale (20) | 7 | 9 | LMS/CMS + XBlock/plugin model needs strong structure |
| Async/event/task ecosystem fit (15) | 7 | 9 | 260 celery task refs + event bus/Kafka/Redis settings |
| Data/integration heterogeneity tolerance (15) | 7 | 9 | SQL + Mongo/modulestore + S3 + cache + external services |
| Runtime efficiency (10) | 9 | 7 | Go wins on footprint/latency |
| Hiring/operability for large enterprise backends (10) | 7 | 8 | Java usually stronger for long-lived large teams |
| **Total (100)** | **71** | **87** | Java preferred for this repository profile |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| planning skill docs mention `templates/` but actual path is `assets/templates/` | Switched to actual path and continued |
| Maven cannot resolve external artifacts in current environment | Marked runtime/test verification as blocked by network; continue implementing code and docs |

## Implementation Findings
- `backend-java` 已具备最小可运行工程结构：
  - Spring Boot application entry
  - global exception handling
  - request id filter
  - `/api/v1/health`
  - notification preference sample APIs
- 当前测试阻塞点不是代码编译错误，而是依赖下载受限（`repo.maven.apache.org` DNS 失败）。
- Wave-1 已完成增强：
  - 新增 `RFC-001`：`docs/backend-rfc/RFC-001-domain-boundary-wave1.md`
  - 通知偏好仓储改为可切换：
    - `inmemory`（默认）
    - `jdbc`（`application-jdbc.yml` + Flyway 表结构）
  - 新增兼容接口路径：`/api/legacy/users/{userId}/notification-preferences`
  - 测试扩展到标准路径和兼容路径读写
- Wave-2 基础能力已补齐：
  - `RFC-002` 灰度路由与回退机制文档
  - `PUT` 接口支持 `X-Idempotency-Key`
  - 新增幂等仓储（inmemory/jdbc 对应实现）
  - 新增领域事件抽象 `DomainEventPublisher` 与通知偏好变更事件模型
- 已按用户要求切换为“直接替换”路径（不做灰度）：
  - 新增 `RFC-003` 说明 big-bang cutover 的执行与验收条件
  - Spring 新增核心域骨架：
    - `identity`：用户注册/查询
    - `enrollment`：选课/查询/退课
  - 新增 Flyway `V2` 迁移：`user_profile` 与 `enrollment_record`
- 平台层基础能力已升级：
  - 统一返回结构 `ApiResponse<T>`（`code/message/data/error`）
  - 全局异常处理器支持业务异常、验证异常、未知异常统一包装
  - AOP 鉴权注解：
    - `@RequireLogin`
    - `@RequireRole`
    - `@RequirePermission`
    - `@RequireResearchGroup`
  - 请求头上下文解析：`X-User-Id` / `X-Roles` / `X-Permissions` / `X-Research-Groups`
- 全量重构继续推进：
  - 新增 `learning-progress` 域（查询/更新）及 JDBC+内存双仓储
  - 新增 Flyway `V3`：`learning_progress` 表
- 全量重构核心域继续扩展：
  - 新增 `grading` 域（成绩写入/查询）
  - 新增 `certificate` 域（发放/查询/撤销）
  - 新增 Flyway `V4`：`grade_record` 与 `certificate_record`
  - 读写接口已统一接入 `ApiResponse<T>` 与 AOP 权限注解
- 全量重构继续推进到课程与任务域：
  - 新增 `course` 域（课程元数据更新/查询）
  - 新增 `job-orchestrator` 域（任务提交/查询/状态迁移）
  - 新增 Flyway `V5`：`course_metadata` 与 `job_record`
- 合同与可运维能力继续增强：
  - 新增分页列表接口（users/courses/jobs），统一 `PageResponse` 结构
  - 新增 OpenAPI 分组配置（platform / identity-course / learning）
  - 新增 job scheduler 骨架（定时扫描 pending job 并推进状态）
- Spring-only 运行链路已补齐：
  - 新增容器构建：`backend-java/Dockerfile`
  - 新增部署编排：`backend-java/deploy/docker-compose.spring-only.yml`
  - 新增脚本：
    - `backend-java/scripts/start-spring-only.sh`
    - `backend-java/scripts/stop-spring-only.sh`
    - `backend-java/scripts/export-openapi.sh`
  - 新增切换检查清单：`docs/backend-rfc/SPRING_ONLY_CUTOVER_CHECKLIST.md`
- Django 运行下线准备：
  - 新增 `RFC-004-django-runtime-decommission.md`
  - 新增 `backend-java/scripts/smoke-spring-only.sh` 用于上线前最小链路验证
- 契约冻结与覆盖对账能力已落地：
  - 新增脚本：
    - `backend-java/scripts/export-spring-endpoint-index.py`
    - `backend-java/scripts/discover-frontend-api-paths.sh`
    - `backend-java/scripts/check-contract-coverage.py`
    - `backend-java/scripts/freeze-contracts.sh`
  - 产物：
    - `backend-java/contracts/spring-endpoints.txt`
    - `backend-java/contracts/frontend-api-paths.txt`
    - `backend-java/contracts/coverage-report.md`
  - 新增 `API_CONTRACT_FREEZE.md` 记录当前覆盖差距和收敛策略
- 未覆盖 API 家族迁移已开始：
  - 已实现 `/api/v1/coursexs/`（create/get/list）
  - 契约对账结果从 `matched=0/unmatched=8` 更新为 `matched=1/unmatched=7`
- 未覆盖 API 家族继续收敛：
  - 已实现 `/enterprise/api/v1/enterprise-learner/`（upsert/get/list）
  - 契约对账结果更新为 `matched=3/unmatched=5`
- 未覆盖 API 家族继续收敛（第二波）：
  - 已实现 `/consent/api/v1/data_sharing_consent`（upsert/get）
  - 已补 `/enterprise/api/v1` 与 `/consent/api/v1` 根路径探活接口
  - 契约对账结果更新为 `matched=5/unmatched=3`

## Resources
- `/machine/Learning/Code/edx/setup.py`
- `/machine/Learning/Code/edx/requirements/constraints.txt`
- `/machine/Learning/Code/edx/lms/__init__.py`
- `/machine/Learning/Code/edx/cms/__init__.py`
- `/machine/Learning/Code/edx/lms/envs/common.py`
- `/machine/Learning/Code/edx/cms/envs/common.py`
- `/machine/Learning/Code/edx/openedx/envs/common.py`
- `/machine/Learning/Code/edx/BACKEND_REFACTOR_PLAN.md`
- `/machine/Learning/Code/edx/backend-java`

## Visual/Browser Findings
- N/A (no browser/image operations)
