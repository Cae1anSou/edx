# Task Plan: Backend Rewrite Language Decision (Go vs Java)

## Goal
基于当前仓库的真实技术结构与耦合复杂度，给出后端重写应选 Go 还是 Java 的结论与迁移策略。

## Current Phase
Phase 5

## Phases
### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints and requirements
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Architecture Evidence Collection
- [x] Quantify Django coupling and plugin surface
- [x] Inspect background jobs, data stores, and integration points
- [x] Identify migration risk hotspots
- **Status:** complete

### Phase 3: Decision Framework
- [x] Build weighted decision criteria for Go vs Java
- [x] Score options with repository evidence
- [x] Draft recommendation and rationale
- **Status:** complete

### Phase 4: Verification
- [x] Cross-check assumptions against actual files
- [x] Identify unknowns and residual risks
- [x] Ensure recommendation is actionable
- **Status:** complete

### Phase 5: Delivery
- [x] Provide final recommendation to user
- [x] Include practical migration path and first milestones
- **Status:** complete

## Key Questions
1. 当前项目是典型 CRUD 还是高度插件化、事件化、异构数据后端？
2. 迁移最重的成本在业务代码本身，还是框架生态（Django app、插件、管理后台、任务系统）？
3. 以最小迁移风险为目标，Go 与 Java 哪个更匹配当前复杂度？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use planning-with-files skill artifacts | Task requires many tool calls and evidence tracking |
| Use repository-driven evidence rather than generic language comparison | User requested project-specific recommendation |
| Choose Java over Go for full backend rewrite | Lower migration risk for this repo's complexity and integration surface |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| planning-with-files template path mismatch (`templates/` not found) | 1 | Used `assets/templates/` in skill directory |
