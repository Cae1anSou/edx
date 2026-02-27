# Task Plan: Java Backend Refactor Kickoff

## Goal
按照 `BACKEND_REFACTOR_PLAN.md` 持续推进后端重构：完成分支与基线提交后，落地可扩展的 Java 后端基础能力，并进入第一波迁移准备（RFC、持久化、兼容路由）。

## Current Phase
Phase 4

## Phases
### Phase 1: Branch & Baseline Commit
- [x] Create dedicated refactor branch
- [x] Commit existing uncommitted planning artifacts
- **Status:** complete

### Phase 2: Phase-0 Java Foundation
- [x] Bootstrap Spring Boot project
- [x] Add global error/request-id foundation
- [x] Add health endpoint and notification-preference sample domain
- [x] Commit bootstrap changes
- **Status:** complete

### Phase 3: Wave-1 Hardening
- [x] Write `RFC-001` for domain boundary and wave-1 APIs
- [x] Upgrade sample domain to JDBC + Flyway (switchable repository)
- [x] Add legacy-compatible API adapter endpoint
- [x] Extend tests and docs
- [ ] Commit wave-1 hardening changes
- **Status:** in_progress

### Phase 4: Handoff
- [x] Provide summary, known constraints, and immediate next steps
- **Status:** complete

### Phase 5: Wave-2 Foundation
- [x] Add RFC-002 for gateway routing and rollback strategy
- [x] Add idempotency-key support for write APIs
- [x] Add domain event publisher abstraction and notification change event
- [x] Commit wave-2 foundation changes
- **Status:** complete

### Phase 6: Direct Cutover Enablement
- [x] Switch strategy to direct replacement (no gray)
- [x] Add core domains in Spring (identity + enrollment)
- [x] Add Flyway schema for new domains
- [x] Add RFC-003 big-bang cutover doc
- [x] Commit direct-cutover changes
- **Status:** complete

### Phase 7: Platform Foundation + Ongoing Full Rewrite
- [x] Add unified response model and enhanced global exception handler
- [x] Add reusable AOP access-control annotations (login/role/permission/research)
- [x] Wire annotations into existing controllers
- [x] Continue full rewrite with learning-progress domain
- [ ] Commit phase-7 changes
- **Status:** in_progress

## Key Questions
1. 如何把第一批 Java 代码变成可复制的迁移模板，而不是一次性 demo？
2. 如何在不影响现网的前提下支持新旧接口并行（兼容路径 + 可回退）？
3. 在当前网络受限环境下，哪些验证可本地完成，哪些需在有外网 CI 执行？

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Continue using planning-with-files artifacts | Multi-step implementation needs persistent state |
| Keep default repo type as in-memory, JDBC via property switch | Allow no-DB local startup while enabling migration-ready path |
| Implement compatibility adapter endpoint in Java service | Prepare for gateway-level Strangler routing without immediate frontend changes |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| `mvn test` failed writing `~/.m2` | 1 | Switched to `-Dmaven.repo.local=/tmp/.m2` |
| Maven dependency resolution failed (`repo.maven.apache.org` DNS) | 2 | Proceeded with code changes, mark tests as blocked by network |
