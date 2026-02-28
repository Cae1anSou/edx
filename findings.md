# Findings & Decisions

> Historical note (split branch): As of 2026-02-28, top-level `lms/` and `cms/` directories were removed from this branch. Any references to those paths below are migration-history context from earlier phases.

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
- 未覆盖 API 家族继续收敛（第三波）：
  - 已实现 `/taxonomy/api/v1/learners-current-job`（upsert/list）
  - 已补 `/api/v1` 根路径探活接口
  - 契约对账结果更新为 `matched=7/unmatched=1`（剩余外部 `/api/v2/tickets.json`）
- 1:1 行为迁移继续推进（zendesk 兼容）：
  - 已实现 `/zendesk_proxy/v0`（兼容旧 payload，限流 50/h）
  - 已实现 `/zendesk_proxy/v1`（兼容新 payload，支持 `X-User-Id`/`X-User-Email` 回填 requester，限流 50/h）
  - 已实现 `/api/v2/tickets.json` 兼容代理入口
  - 状态码对齐：字段缺失返回 `400`，限流返回 `429`，未配置 Zendesk 返回 `503`，上游调用返回透传状态码
  - 契约对账结果更新为 `matched=8/unmatched=0`
- 联网验证已恢复：
  - `mvn -Dmaven.repo.local=/tmp/.m2 test` 可成功下载依赖并执行测试
  - 暴露并修复 3 个真实兼容问题：`enterprise/taxonomy` 的尾斜杠路径、`job` 测试 payload JSON 转义
  - 修复后测试结果：`Tests run: 18, Failures: 0, Errors: 0`
- 1:1 行为迁移新增 agreements 域：
  - 已实现 `GET/POST /api/agreements/v1/integrity_signature/{courseId}`
  - 已实现 `POST /api/agreements/v1/lti_pii_signature/{courseId}`
  - 对齐关键行为：
    - 功能关闭返回 `404`
    - 非 staff 跨用户查 integrity 返回 `403` + message
    - `lti_tools` 缺失返回 `500`
  - 新增测试后结果更新为：`Tests run: 20, Failures: 0, Errors: 0`
- 修复契约工具链问题：
  - `export-spring-endpoint-index.py` 现支持 `@GetMapping({"", "/"})` 这类数组注解
  - 覆盖报告恢复为 `matched=8/unmatched=0`
- 1:1 行为迁移新增 bookmarks 域：
  - 已实现 `GET/POST /api/bookmarks/v1/bookmarks/`
  - 已实现 `GET/DELETE /api/bookmarks/v1/bookmarks/{username},{usage_id}/`
  - 已对齐关键行为：
    - 匿名 `401`
    - 跨用户访问 `403`
    - 详情 `usage_id` 非法时 `404`
    - 列表创建参数非法时 `400`（含 `developer_message/user_message`）
  - 已实现分页返回字段：`count/next/previous/num_pages/current_page/start/results`
  - 测试结果更新为：`Tests run: 22, Failures: 0, Errors: 0`
- 1:1 行为迁移新增 course_experience/api/v1 域：
  - 已实现 `POST /api/course_experience/v1/reset_course_deadlines`
  - 已实现 `POST /api/course_experience/v1/reset_all_course_deadlines/`
  - 已实现 `GET /api/course_experience/v1/course_deadlines_info/{courseKey}`
  - 为 `reset_all` 新增 enrollment 仓储按用户查询能力（inmemory + jdbc）
  - 测试结果更新为：`Tests run: 24, Failures: 0, Errors: 0`
- 1:1 行为迁移新增语言偏好域：
  - 已实现 `PATCH /lang_pref/update_language`
  - 已实现 `GET/POST /update_lang/`（预览语言兼容入口）
  - `update_language` 返回 `Set-Cookie` 更新语言偏好
  - `update_lang` 未认证返回 `401`，POST 动作返回 `302` 重定向至 `/update_lang/`
  - 测试结果更新为：`Tests run: 25, Failures: 0, Errors: 0`
- 1:1 行为迁移新增 toggles 域：
  - 已实现 `GET /api/toggles/v0/state/`
  - 已对齐 staff 访问语义：non-staff 返回 `403`
  - 已返回 toggle report 基本结构：`django_settings` + `waffle_flags`
  - 测试结果更新为：`Tests run: 26, Failures: 0, Errors: 0`
- 兼容面收口（legacy + usercompat + 合同工具）：
  - 新增 legacy 兼容控制器，覆盖前端发现的剩余 API 家族（commerce/contentstore/courses/team/help_center/uploads 等）
  - 新增 user compat 端点，覆盖 `/api/user/v0|v1/...` 常用注册、会话、偏好路径
  - 改进 `discover-frontend-api-paths.sh` 与 `check-contract-coverage.py` 的模板字符串清洗/归一化逻辑
  - 契约冻结结果更新为：`Spring endpoints=69`, `frontend paths=42`, `matched=42`, `unmatched=0`
  - 在 JDK 25 环境新增 Mockito 配置 `mock-maker-subclass`，恢复测试稳定执行：`Tests run: 27, Failures: 0, Errors: 0`

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

## Frontend Decoupling Findings (2026-02-28)
- React micro-frontend `frontend-app-studio-dashboard` 已覆盖当前 `StudioDashboardFrontendController` 承载的业务页面，但存在兼容细节缺口：
  - 通知偏好仅覆盖 `v3` 与单一路径，未完整覆盖 legacy `v2` 和 `preferences/update` 的 GET/POST/patch 变体。
  - 课程团队查询此前仅支持 `email`，后端 legacy 已支持 `email/username/user_id`。
  - 团队接口的 `expand` 与 membership `admin` 查询参数此前未在页面暴露。
  - SPA 路由参数形态存在轻微不对齐（后端含 `/course/{courseKey:.+}`、`/rerun/` 形态）。
- 已完成修复：
  - API 层新增 `fetchNotificationPreferencesV2`、`get/postNotificationPreferenceUpdate`。
  - 页面层扩展通知偏好与团队参数输入能力。
  - React 路由补齐 `/course/:courseKey`、`/rerun/`、`/rerun/:sourceCourseKey/`。
  - 新增 `backend-java/scripts/check-spa-route-parity.py` 做后端-前端路由一致性验收。
- 校验结果：
  - `python3 backend-java/scripts/check-spa-route-parity.py` 返回通过（`backend routes: 32`, `frontend routes: 32`）。

## Scope Blocker (LMS/CMS Full Migration)
- 当前仓库快照中：
  - 当时 `lms/` 仅包含 `lms/static/**`（历史状态）
  - 当时 `cms/` 仅包含 `cms/static/**`（历史状态）
- 未发现可迁移的 Django 端页面源（`views.py` / `urls.py` / `templates/`），因此无法在本仓库内完成“LMS/CMS 全量页面迁移到前后端分离”。
- 结论：本轮可完成的是 Studio/legacy React 微前端迁移闭环；若要继续全量迁移，需要提供包含 LMS/CMS 服务端页面源码的仓库或子模块。

## Master Source Intake (2026-02-28)
- 用户确认 `master` 分支包含源码后，已从 `master` 抽取迁移参考文件到：
  - `migration-reference/master/cms/*`
  - `migration-reference/master/lms/*`
- 重点参考了 `master:cms/urls.py` 的 legacy Studio 页面路径，并完成 React 路由与后端 SPA 承载路由扩展：
  - `home/home_library`
  - `library/...`、`library/.../team`
  - `course_team/...`
  - `videos/...`
  - `group_configurations/...`
  - `settings/details|grading|advanced/...`
- 现状：这些 legacy URL 已可进入 React 应用；对应细分页面能力已映射到现有 React 页面模块。
## Frontend Legacy Routing Findings (2026-02-28, continued)
- Risk confirmed: mapping `/update_lang/` root into SPA controller breaks backend dark-language compatibility endpoint; test expected `401` but got `500`.
- Fix applied: removed `/update_lang` and `/update_lang/` from Spring SPA controller and React root route mapping, while retaining `/update_lang/*` compatibility shell route.
- Migration quality improved by replacing generic shell catch-all usage with domain-specific React pages for major LMS/CMS legacy families.
## Frontend Legacy UX Findings (2026-02-28, continued)
- Prior migration phase had many route aliases landing on pages without route-derived context, reducing practical operability when opened from legacy deep links.
- Added route-context seeding for operations/content/help/search pages to preserve workflow continuity from old LMS/CMS URL patterns.
- Help token routes now map to Help Center page instead of generic shell, reducing placeholder-path usage.
## Video/Transcript Migration Findings (2026-02-28)
- Previously, several CMS media endpoints were only route-carried and lacked corresponding React page actions.
- Uploads migration now includes first-class operations for video feature probing and transcript-related endpoints, reducing placeholder compatibility behavior.
- Remaining limitation: frontend build validation is still blocked in this sandbox due to `esbuild` EPERM during install; runtime verification requires unrestricted Node environment.
## CMS Entry Migration Findings (2026-02-28)
- Several Studio authoring entry URLs from legacy `cms/urls.py` were not yet routed to React pages (`course_info`, `course_notifications`, `xblock`, `transcripts`).
- After this phase, these entries are SPA-carried and page-routed with route-context seeding, reducing dead-end paths during cutover.
## Legacy LMS/CMS Tail Findings (2026-02-28)
- Additional low-frequency legacy entries (`organizations`, error preview routes) needed explicit SPA migration to avoid fallback redirects.
- LMS deep links with `jump_to` and wiki-related segments were previously parsed as generic; now classified into courseware/discussion for better continuity.
## Identity Route Findings (2026-02-28)
- Legacy identity routes were already mapped but not semantically differentiated.
- Added path-aware data loading for `course_modes` improves practical migration quality without introducing new route families.
## Slashful Key Findings (2026-02-28)
- Legacy routes using old-style `org/course/run` keys can fail when only single-segment params are used.
- Added wildcard aliases and path parsers to preserve compatibility for slash-delimited keys across CMS/LMS migrated routes.
## Route-Aware UX Findings (2026-02-28)
- Some migrated pages still required manual action after opening a legacy deep link.
- Added route-aware auto-execution for help/search entry pages to reduce friction and better preserve legacy user flow.
## XBlock/Transcript Hardening Findings (2026-02-28)
- Trailing slash variants and complex xblock identifiers can break route matching or key extraction if not handled explicitly.
- Added alias routes and full-key parsing to reduce legacy deep-link breakage in content authoring flows.
## LMS Tail Entry Findings (2026-02-28)
- `change_enrollment`, `notify`, and `rss_proxy` are common LMS entry families that were present in legacy URLs but not explicitly mapped in React routes.
- After mapping and context-seeding, these routes now enter meaningful React pages instead of fallback behavior.
## Notify/RSS Closure Findings (2026-02-28)
- Root forms of `notify` and `rss_proxy` were not explicitly carried in backend route map.
- Added root aliases to avoid 404 on these legacy entry points and improved page-level path diagnostics.
## Dashboard/Search-Reindex Findings (2026-02-28)
- Legacy learner dashboard includes subroutes under `/dashboard/`; root-only mapping is insufficient.
- Old-style `org/course/run` route form for `search_reindex` benefits from explicit 3-segment route aliases on frontend.
## Notify/RSS Trailing Slash Findings (2026-02-28)
- Legacy links may include optional trailing slashes on subpaths; explicit aliases reduce route-matching edge cases.
- Added both frontend and backend carrier aliases to keep behavior consistent.
## Internal Entry Slash Findings (2026-02-28)
- Even non-legacy-facing SPA entries benefit from explicit trailing-slash aliases due to proxies/bookmarks that normalize URLs.
- Added frontend/backed paired aliases to minimize redirect/fallback surprises.
## Search-Reindex Backend Closure Findings (2026-02-28)
- Frontend alias existed for old-style search_reindex path while backend carrier lacked an explicit equivalent.
- Added backend alias to ensure full-path compatibility under Spring SPA routing.
## Authoring/System Subpath Findings (2026-02-28)
- Exact-only routes for authoring/system utility pages are brittle when legacy navigation appends subpaths.
- Added wildcard/subpath aliases plus context display to improve debuggability and deep-link compatibility.
## Signin/Signup Slash Findings (2026-02-28)
- Legacy auth entrypoints can be hit with optional trailing slash; explicit aliases reduce unnecessary fallback redirects.
- Dashboard subpath observability improves validation of learner dashboard deep-link migration.
## Parameterized Slash Backfill Findings (2026-02-28)
- Frontend router had several parameterized trailing-slash aliases that backend SPA carrier did not explicitly include.
- Added backend aliases to avoid mismatch when upstream systems normalize URLs with trailing slash.
## Wildcard Context Findings (2026-02-28)
- Wildcard fallback routes can bypass `useParams`-based seeding and leave pages without legacy context.
- Added location-path parsing in affected pages to restore course-key/grader-key continuity.
## Legacy Tail Route Sweep Findings (2026-02-28)
- Master-reference legacy tails still had uncovered SPA entry points (`lang_pref/update_language`, `preview/xblock`, `xblock/resource`, `export_git`, `certificates`, `authoring-api/ui|schema`, `course/*/entrance_exam`, `event`, `calculate`).
- Added explicit frontend + backend route coverage to reduce remaining 404/fallback cases during LMS/CMS cutover.
## Release Readiness Findings (2026-02-28)
- Backend regression passed:
  - `backend-java mvn test` -> `Tests run: 39, Failures: 0, Errors: 0`.
  - `backend-java mvn test -Dspring.profiles.active=jdbc` -> `Tests run: 39, Failures: 0, Errors: 0`.
  - JDBC profile confirms Flyway migrations `V1..V9` apply successfully on startup.
- Frontend regression passed at build level:
  - `frontend-app-studio-dashboard npm run build` succeeded after Vite config fix.
  - Added Vite `/api` proxy in both `vite.config.ts` and `vite.config.js` (default target `http://127.0.0.1:8080`, env-overridable by `VITE_BACKEND_ORIGIN`).
- Contract coverage passed:
  - `backend-java/scripts/freeze-contracts.sh` -> `Unmatched: 0`.
- Expanded release E2E passed:
  - New script `frontend-app-studio-dashboard/e2e/release-readiness-e2e.ts`.
  - Covers route rendering + auth (401/200) + write success (`POST /api/studio/v1/courses` with `X-Roles: INSTRUCTOR`) + error branch (`400 INVALID_ARGUMENT`).
- Pre-production style smoke integration passed (when backend reachable in same permission context):
  - `backend-java/scripts/smoke-spring-only.sh`
  - `backend-java/scripts/smoke-frontend-compat.sh`
- Remaining blocker:
  - Root monorepo JS unit tests (`npm run test-jest`) are blocked in current environment due legacy dependency/toolchain issues (`jest` missing; `npm install` cache permission + npm CLI exit-handler failure under Node 24).

- Root monorepo Jest blocker resolved under RAN:
  - `pnpm install --frozen-lockfile` completed.
  - `npm run test-jest -- --runInBand` passed (`1 suite, 3 tests`).

## Contract & E2E Tooling Findings (2026-02-28, continued)
- Fixed false negatives in contract coverage pipeline:
  - `export-spring-endpoint-index.py` now correctly combines class-level `@RequestMapping` with method mappings even when extra class annotations exist between mapping and class declaration.
  - Endpoint indexing now includes `/api/studio/v1/*`, removing prior mismatch noise.
- Fixed template normalization edge case:
  - `check-contract-coverage.py` now handles dangling `${suffix|query|problemQuery` expressions without closing `}`.
- Verification after fixes:
  - `python3 backend-java/scripts/export-spring-endpoint-index.py`
  - `python3 backend-java/scripts/check-contract-coverage.py`
  - Coverage report now: `Matched=76`, `Unmatched=0`, `Unresolved template expressions=0`.
- E2E pipeline hardening:
  - Removed `@ts-nocheck` from `frontend-app-studio-dashboard/e2e/*.ts`.
  - Added dedicated `tsconfig.e2e.json` and npm scripts: `e2e:build`, `e2e:headless`, `e2e:release`.
  - Added local `e2e/node-shims.d.ts` to keep TS compile independent of external `@types/node` download in restricted network environments.
