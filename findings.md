# Findings & Decisions

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

## Resources
- `/machine/Learning/Code/edx/setup.py`
- `/machine/Learning/Code/edx/requirements/constraints.txt`
- `/machine/Learning/Code/edx/lms/__init__.py`
- `/machine/Learning/Code/edx/cms/__init__.py`
- `/machine/Learning/Code/edx/lms/envs/common.py`
- `/machine/Learning/Code/edx/cms/envs/common.py`
- `/machine/Learning/Code/edx/openedx/envs/common.py`

## Visual/Browser Findings
- N/A (no browser/image operations)
