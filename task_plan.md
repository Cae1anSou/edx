# Task Plan: Java Backend Refactor Kickoff

## Goal
按照 `BACKEND_REFACTOR_PLAN.md` 持续推进后端重构：完成分支与基线提交后，落地可扩展的 Java 后端基础能力，并进入第一波迁移准备（RFC、持久化、兼容路由）。

## Current Phase
Phase 23

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
- [x] Commit phase-7 changes
- **Status:** complete

### Phase 8: Full Rewrite Core Domains Expansion
- [x] Add grading domain (API/service/repository/inmemory+jdbc)
- [x] Add certificate domain (API/service/repository/inmemory+jdbc)
- [x] Add Flyway schema for grading/certificate
- [x] Extend integration tests for grading/certificate
- [x] Commit phase-8 changes
- **Status:** complete

### Phase 9: Course + Job Orchestrator Expansion
- [x] Add course metadata domain (API/service/repository/inmemory+jdbc)
- [x] Add job orchestrator domain (submit/query/transition)
- [x] Add Flyway schema for course/job
- [x] Extend integration tests for course/job workflows
- [x] Commit phase-9 changes
- **Status:** complete

### Phase 10: Full Rewrite Contract & Operability Hardening
- [x] Add list endpoints with `PageResponse` for users/courses/jobs
- [x] Add OpenAPI grouped configuration for versioned contracts
- [x] Add job executor scheduler skeleton for async flow replacement
- [x] Commit phase-10 changes
- **Status:** complete

### Phase 11: Spring-only Runtime Packaging
- [x] Add Spring-only docker compose deployment skeleton
- [x] Add startup/shutdown scripts for Spring runtime
- [x] Add OpenAPI contract export script
- [x] Add Spring-only cutover checklist document
- [x] Commit phase-11 changes
- **Status:** complete

### Phase 12: Django Runtime Decommission Readiness
- [x] Add Django runtime decommission RFC
- [x] Add Spring-only smoke validation script
- [x] Commit phase-12 changes
- **Status:** complete

### Phase 13: Contract Freeze & Frontend Coverage
- [x] Add scripts for Spring endpoint index export
- [x] Add scripts for frontend API discovery
- [x] Add automated coverage report generation
- [x] Add contract freeze RFC/checklist doc
- [x] Commit phase-13 changes
- **Status:** complete

### Phase 14: Unmatched API Family Migration
- [x] Implement `/api/v1/coursexs/` API family in Spring
- [x] Add CourseX repository/service/controller + migration + tests
- [x] Re-run contract freeze and verify unmatched count decreases
- [x] Commit phase-14 changes
- **Status:** complete

### Phase 15: Unmatched Enterprise API Migration
- [x] Implement `/enterprise/api/v1/enterprise-learner/` in Spring
- [x] Add enterprise repository/service/controller + migration + tests
- [x] Re-run contract freeze and verify unmatched count decreases
- [x] Commit phase-15 changes
- **Status:** complete

### Phase 16: Unmatched Consent API Migration
- [x] Implement `/consent/api/v1/data_sharing_consent` in Spring
- [x] Add consent repository/service/controller + migration + tests
- [x] Add enterprise/consent root API endpoints for legacy root paths
- [x] Re-run contract freeze and verify unmatched count decreases
- [x] Commit phase-16 changes
- **Status:** complete

### Phase 17: Unmatched Taxonomy API Migration
- [x] Implement `/taxonomy/api/v1/learners-current-job` in Spring
- [x] Add taxonomy repository/service/controller + migration + tests
- [x] Add `/api/v1` root endpoint compatibility
- [x] Re-run contract freeze and reduce unmatched to external-only
- [x] Commit phase-17 changes
- **Status:** complete

### Phase 18: Zendesk 1:1 Compatibility Closure
- [x] Implement Spring-compatible endpoints for `/zendesk_proxy/v0` and `/zendesk_proxy/v1`
- [x] Implement compatibility endpoint `/api/v2/tickets.json`
- [x] Add status-code aligned behavior (400/429/503/proxy status)
- [x] Re-run contract freeze and achieve unmatched=0
- [x] Commit phase-18 changes
- **Status:** complete

### Phase 19: Build Verification & Compatibility Fixes
- [x] Run `mvn test` with network-enabled dependency resolution
- [x] Fix trailing-slash compatibility for enterprise/taxonomy endpoints
- [x] Fix invalid job payload test input format
- [x] Commit phase-19 changes
- **Status:** complete

### Phase 20: Agreements API 1:1 Migration
- [x] Implement `/api/agreements/v1/integrity_signature/{courseId}` (GET/POST)
- [x] Implement `/api/agreements/v1/lti_pii_signature/{courseId}` (POST)
- [x] Add behavior-compatible status handling (403/404/500 branches)
- [x] Extend integration tests and pass full Maven test suite
- [x] Fix contract endpoint index parser for array-style mapping annotations
- [x] Commit phase-20 changes
- **Status:** complete

### Phase 21: Bookmarks API 1:1 Migration
- [x] Implement `/api/bookmarks/v1/bookmarks/` (GET/POST)
- [x] Implement `/api/bookmarks/v1/bookmarks/{username},{usage_id}/` (GET/DELETE)
- [x] Align major error semantics (`400/401/403/404`) and developer/user message format
- [x] Add pagination response fields (`count/next/previous/num_pages/current_page/start/results`)
- [x] Extend integration tests and pass full Maven test suite
- [x] Commit phase-21 changes
- **Status:** complete

### Phase 22: Course Experience API v1 Migration
- [x] Implement `POST /api/course_experience/v1/reset_course_deadlines`
- [x] Implement `POST /api/course_experience/v1/reset_all_course_deadlines/`
- [x] Implement `GET /api/course_experience/v1/course_deadlines_info/{courseKey}`
- [x] Add enrollment repository query support for reset-all aggregation
- [x] Extend integration tests and pass full Maven test suite
- [x] Commit phase-22 changes
- **Status:** complete

### Phase 23: Language Preference / Dark Lang Compatibility
- [x] Implement `PATCH /lang_pref/update_language` cookie update endpoint
- [x] Implement `GET/POST /update_lang/` compatibility endpoint
- [x] Add integration tests and pass full Maven test suite
- [ ] Commit phase-23 changes
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
| Maven dependency resolution failed (`repo.maven.apache.org` DNS) | 2 | Resolved by enabling networked Maven download (RAN) and rerunning tests |
