# Task Plan: Java Backend Refactor Kickoff

## Goal
按照 `BACKEND_REFACTOR_PLAN.md` 持续推进后端重构：完成分支与基线提交后，落地可扩展的 Java 后端基础能力，并进入第一波迁移准备（RFC、持久化、兼容路由）。

## Current Phase
Phase 26

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
- [x] Commit phase-23 changes
- **Status:** complete

### Phase 24: Toggle State API Compatibility
- [x] Implement `GET /api/toggles/v0/state/` compatibility endpoint
- [x] Enforce staff-only access semantics (`403` for non-staff)
- [x] Add integration tests and pass full Maven test suite
- [x] Commit phase-24 changes
- **Status:** complete

### Phase 25: Legacy/User Compatibility Sweep + Contract Zero-Unmatched
- [x] Add broad legacy compatibility endpoints for unmatched frontend paths
- [x] Add user compatibility endpoints (`/api/user/v0|v1/...`)
- [x] Expand frontend path discovery and normalize template-string artifacts
- [x] Stabilize tests on JDK 25 via Mockito subclass mock maker
- [x] Re-run contract freeze to reach unmatched `0`
- [ ] Commit phase-25 changes
- **Status:** in_progress

### Phase 26: Frontend Decoupling Completion (React)
- [x] Close legacy notification compatibility gaps (`v2/v3`, one-click update GET/POST/patch variants)
- [x] Upgrade team management query compatibility (`email/username/user_id`, team `expand`, membership `admin`)
- [x] Align React SPA routes with backend frontend-controller route set
- [x] Add automated parity check script for backend-vs-frontend SPA routes
- [ ] Run full frontend build in unrestricted environment and fix any runtime regressions (blocked in current sandbox)
- [ ] Commit phase-26 changes
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
| `npm install` for `frontend-app-studio-dashboard` failed (`esbuild` spawnSync EPERM) | 1 | Continued with static route/API parity checks; build verification pending in unrestricted Node environment |
| Cannot perform full LMS/CMS page migration in this repo snapshot | 1 | `lms/` and `cms/` contain only `static/` assets; no Django views/templates/urls to migrate |
### Phase 26.1: Legacy Route Deepening and Regression Guard
- [x] Expand trailing-slash and root-entry compatibility routes in Spring SPA controller.
- [x] Re-map LMS/CMS legacy route families from shell placeholders to concrete React pages.
- [x] Fix `/update_lang/` root endpoint regression by excluding it from SPA mapping.
- [x] Re-run route parity and backend tests.
- [ ] Re-run frontend build in unrestricted node environment (still blocked in current sandbox).
- **Status:** in_progress
### Phase 26.2: Legacy Deep-Link Operability
- [x] Move `/help_token*` from shell page to concrete React help page.
- [x] Add route-context prefill for `import/export/checklists` migration page.
- [x] Add route-context prefill for `container/tabs/textbooks` migration page.
- [x] Add route-context prefill for support/help-token/search entry flows.
- [x] Re-run SPA parity and backend tests.
- [ ] Run frontend build in unrestricted environment and fix TS/runtime issues if any (sandbox blocked).
- **Status:** in_progress
### Phase 26.3: Media/Transcript Compatibility Completion
- [x] Add React API clients for legacy video/transcript endpoint family.
- [x] Expand Uploads page with operation panels for transcript/video workflows.
- [x] Add route aliases and backend SPA carrier paths for transcript/video endpoints.
- [x] Add deep-link seed parsing for legacy media URLs.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime verification in unrestricted environment.
- **Status:** in_progress
### Phase 26.4: Legacy CMS Entry Closure
- [x] Migrate `course_info/course_info_update/course_notifications` legacy routes.
- [x] Migrate `xblock/*` legacy authoring routes.
- [x] Migrate `transcripts/*` utility routes.
- [x] Add page-level route-context extraction where needed.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime verification in unrestricted environment.
- **Status:** in_progress
### Phase 26.5: Tail Route Coverage
- [x] Add `/organizations` route migration.
- [x] Add legacy error preview route migration (`/403/404/429/500/not_found/server_error`).
- [x] Add `/accessibility/` trailing-slash alias.
- [x] Improve `/courses/*` parser for jump/wiki deep-link semantics.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.6: Identity Page Deepening
- [x] Add path-aware behavior for `course_modes*` route family in Identity page.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.7: Slashful Key Hardening
- [x] Add wildcard route aliases for slash-delimited course-key routes.
- [x] Add path-based course-key parsing in affected React pages.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.8: Route-Aware UX Completion
- [x] Add auto-run behavior for `support/help_token` -> help search flow.
- [x] Add auto-run behavior for `search/catalog` -> legacy search flow.
- [x] Improve learner-experience course-key parsing and path observability.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.9: XBlock/Transcript Compatibility Hardening
- [x] Add `/transcripts/*` trailing-slash route compatibility (frontend + backend carrier).
- [x] Add xblock wildcard aliases in frontend router.
- [x] Improve contentstore path parsing for full usage/block key extraction.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.10: LMS Tail Routes
- [x] Add `/change_enrollment` route migration.
- [x] Add `/notify*` and `/rss_proxy*` route migration.
- [x] Enhance learner services page with query-seeded course context.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.11: Notify/RSS Root Compatibility
- [x] Add `/notify` and `/rss_proxy` root route migration (frontend + backend carrier).
- [x] Add route-context observability in destination pages.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.12: Dashboard and Search-Reindex Closure
- [x] Add `/dashboard/*` migration and backend carrier support.
- [x] Add old-style `/course/:org/:number/:run/search_reindex` route aliases.
- [x] Add dashboard page path observability.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.13: Notify/RSS Slash Compatibility
- [x] Add trailing-slash alias routes for `notify` and `rss_proxy` subpaths (frontend + backend carrier).
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.14: Internal Entry Slash Hardening
- [x] Add trailing-slash aliases for migrated internal React entries (frontend + backend carrier).
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.15: Old-Style Search-Reindex Closure
- [x] Add backend SPA carrier alias for `/course/{org}/{number}/{run}/search_reindex`.
- [x] Improve dashboard route observability for `/course/*` entries.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.16: Authoring/System Subpath Compatibility
- [x] Add `/authoring-apis/*` and `/legacy-system-apis/*` frontend routes.
- [x] Add backend SPA carrier support for authoring/system subpaths.
- [x] Add page-level path/course context display.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.17: Auth Slash and Dashboard UX
- [x] Add `/signin/` and `/signup/` compatibility aliases (frontend + backend carrier).
- [x] Improve dashboard subpath observability.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.18: Parameterized Slash Backfill
- [x] Add backend carrier trailing-slash aliases for key parameterized routes.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.19: Wildcard Context Backfill
- [x] Add `/settings/grading/*` context parsing in Instructor tools page.
- [x] Add `/settings/details/*` context parsing in Resource builder page.
- [x] Add `/team/*` context parsing in Team management page.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
### Phase 26.20: Legacy Tail Route Sweep
- [x] Add remaining legacy route aliases from master refs in frontend router.
- [x] Add matching backend SPA carrier aliases.
- [x] Update migration map and findings/progress logs.
- [x] Re-run parity and backend tests.
- [ ] Frontend build/runtime validation in unrestricted environment.
- **Status:** in_progress
