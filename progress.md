# Progress Log

## Session: 2026-02-27

### Phase 1: Requirements & Discovery
- **Status:** complete
- **Started:** 2026-02-27
- Actions taken:
  - Inspected repository root and sampled files to confirm project type.
  - Ran session catchup from planning skill; detected unsynced prior context.
  - Initialized planning artifacts (`task_plan.md`, `findings.md`, `progress.md`).
- Files created/modified:
  - task_plan.md (created)
  - findings.md (created)
  - progress.md (created)

### Phase 2: Architecture Evidence Collection
- **Status:** complete
- Actions taken:
  - Quantified architecture coupling across Django apps, migrations, task system, signals, and admin registrations.
  - Sampled settings to identify infra dependencies (DB/cache/Celery/event bus/AWS/S3/Mongo).
  - Confirmed absence of pre-existing Go/Java backend scaffolding.
- Files created/modified:
  - findings.md (updated)
  - task_plan.md (updated)

### Phase 3: Decision Framework
- **Status:** complete
- Actions taken:
  - Drafted weighted criteria emphasizing migration risk and ecosystem parity for this specific repository.
  - Scored Go vs Java using repository evidence and selected Java as the preferred rewrite target.
- Files created/modified:
  - task_plan.md (updated)
  - findings.md (updated)

### Phase 4: Verification
- **Status:** complete
- Actions taken:
  - Cross-checked key claims against concrete file references (`setup.py`, env settings, Celery init files).
  - Validated recommendation includes residual risk and migration path constraints.
- Files created/modified:
  - findings.md (updated)

### Phase 5: Delivery
- **Status:** complete
- Actions taken:
  - Prepared concise recommendation with rationale and first-step migration milestones.
- Files created/modified:
  - task_plan.md (updated)

## Test Results
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Planning files exist | `ls task_plan.md findings.md progress.md` | Files present | Files present | PASS |
| Architecture scan commands | `find/rg` counts across repo | Obtain coupling metrics | Metrics collected | PASS |

## Error Log
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-02-27 | planning skill template path mismatch | 1 | Used `assets/templates` path |

## 5-Question Reboot Check
| Question | Answer |
|----------|--------|
| Where am I? | Phase 1 in progress |
| Where am I going? | Collect evidence, score Go vs Java, deliver recommendation |
| What's the goal? | Decide backend rewrite language based on this repo evidence |
| What have I learned? | Repo is large Django monolith with plugin-heavy architecture |
| What have I done? | Created planning artifacts and initial repo scan |

## Session: 2026-02-27 (Refactor Kickoff)

### Phase 1: Branch & Baseline Commit
- **Status:** complete
- Actions taken:
  - Created branch `refactor/backend-java-kickoff`.
  - Committed planning and strategy artifacts.
- Files created/modified:
  - BACKEND_REFACTOR_PLAN.md (committed)
  - findings.md (committed)
  - progress.md (committed)
  - task_plan.md (committed)

### Phase 2: Phase-0 Java Foundation
- **Status:** complete
- Actions taken:
  - Created `backend-java` module with Maven + Spring Boot.
  - Added shared error handling, request-id propagation, and health endpoint.
  - Added first sample migration domain: notification preferences.
  - Added initial Spring test.
  - Committed all bootstrap files.
- Files created/modified:
  - backend-java/pom.xml
  - backend-java/src/main/java/org/openedx/backend/**/*
  - backend-java/src/main/resources/application.yml
  - backend-java/src/main/resources/db/migration/V1__baseline.sql
  - backend-java/src/test/java/org/openedx/backend/BackendApplicationTests.java

### Phase 3: Wave-1 Hardening
- **Status:** in_progress
- Actions taken:
  - Session catchup executed and planning files refreshed.
  - Added RFC `docs/backend-rfc/RFC-001-domain-boundary-wave1.md`.
  - Upgraded notification preference repository to property-driven `inmemory/jdbc`.
  - Added Flyway table migration SQL and `jdbc` profile config.
  - Added legacy-compatible adapter endpoints with snake_case contracts.
  - Extended MockMvc tests for v1 and legacy paths.

## Test Results (Kickoff)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Maven test with default repo | `mvn test` | Build/test executes | Failed writing to `~/.m2` | BLOCKED |
| Maven test with local repo override | `mvn -Dmaven.repo.local=/tmp/.m2 test` | Build/test executes | Failed to resolve `repo.maven.apache.org` (DNS) | BLOCKED |
| Maven test after Wave-1 updates | `mvn -Dmaven.repo.local=/tmp/.m2 test` | Build/test executes | Same DNS failure for Maven Central | BLOCKED |

### Phase 4: Wave-2 Foundation
- **Status:** in_progress
- Actions taken:
  - Added `docs/backend-rfc/RFC-002-gateway-routing-and-rollback.md`.
  - Added idempotency repository abstraction and in-memory/JDBC implementations.
  - Updated notification write APIs to accept `X-Idempotency-Key`.
  - Added domain event abstraction and notification changed event model.
  - Extended tests with idempotency behavior scenario.

### Phase 5: Direct Cutover Enablement
- **Status:** in_progress
- Actions taken:
  - Switched migration direction to Spring direct replacement (no gray release dependency).
  - Added identity domain (`/api/v1/users` register/get).
  - Added enrollment domain (`/api/v1/courses/{courseId}/enrollments/{userId}` put/get/delete).
  - Added Flyway V2 schema for identity/enrollment core tables.
  - Added RFC `docs/backend-rfc/RFC-003-bigbang-cutover.md`.
  - Updated README and integration tests for new endpoints.

### Phase 6: Platform Foundation + Full Rewrite Continuation
- **Status:** in_progress
- Actions taken:
  - Added base response model `ApiResponse<T>`.
  - Upgraded global exception handler to unified failure payloads with request path/details.
  - Added AOP access-control annotations and aspect-based enforcement.
  - Added request-header-based auth context resolver.
  - Applied permissions/research checks on core controllers.
  - Added `learning-progress` domain (API/service/repository) with in-memory/JDBC implementations.
  - Added Flyway migration `V3__learning_progress.sql`.
  - Updated tests to assert wrapped response format and auth checks.

### Phase 7: Core Domains Expansion (grading + certificate)
- **Status:** in_progress
- Actions taken:
  - Added grading domain with score update/query API and repository implementations.
  - Added certificate domain with issue/query/revoke API and repository implementations.
  - Added Flyway migration `V4__grading_certificate.sql`.
  - Updated YAML configs for grading/certificate repository selection.
  - Extended integration tests for grading and certificate workflows.

### Phase 8: Core Domains Expansion (course + job orchestrator)
- **Status:** in_progress
- Actions taken:
  - Added course metadata domain with update/query API and repository implementations.
  - Added job-orchestrator domain with submit/query/status-transition API and repository implementations.
  - Added Flyway migration `V5__course_job.sql`.
  - Updated configs for course/job repository mode selection.
  - Extended integration tests for course metadata and job workflow.

### Phase 9: Contract & Operability Hardening
- **Status:** in_progress
- Actions taken:
  - Added paged list endpoints for users, courses, and jobs.
  - Added OpenAPI grouped configuration for API contract organization.
  - Added scheduler skeleton to process pending jobs in batches.
  - Added manual run-once job execution endpoint for operational control.

### Phase 10: Spring-only Runtime Packaging
- **Status:** in_progress
- Actions taken:
  - Added `backend-java/Dockerfile` for Spring backend image build.
  - Added `docker-compose.spring-only.yml` for Spring + PostgreSQL runtime.
  - Added operational scripts:
    - `start-spring-only.sh`
    - `stop-spring-only.sh`
    - `export-openapi.sh`
  - Added `SPRING_ONLY_CUTOVER_CHECKLIST.md` runbook.

### Phase 11: Django Runtime Decommission Readiness
- **Status:** in_progress
- Actions taken:
  - Added RFC `RFC-004-django-runtime-decommission.md`.
  - Added `smoke-spring-only.sh` for pre-cutover runtime validation.

### Phase 12: Contract Freeze & Coverage
- **Status:** in_progress
- Actions taken:
  - Added Spring endpoint index exporter script.
  - Added frontend API path discovery script.
  - Added contract coverage checker script.
  - Added one-shot `freeze-contracts.sh` pipeline script.
  - Added `API_CONTRACT_FREEZE.md` with current mismatch snapshot.

### Phase 13: Unmatched API Family Migration (`coursexs`)
- **Status:** in_progress
- Actions taken:
  - Added `coursex` domain with create/get/list API.
  - Added in-memory and JDBC repositories.
  - Added Flyway migration `V6__coursex.sql`.
  - Added integration tests for `coursexs` flow.
  - Re-ran contract freeze report and reduced unmatched count by 1.

### Phase 14: Unmatched API Family Migration (`enterprise-learner`)
- **Status:** in_progress
- Actions taken:
  - Added enterprise learner domain and `/enterprise/api/v1/enterprise-learner/` API.
  - Added in-memory and JDBC repositories.
  - Added Flyway migration `V7__enterprise_learner.sql`.
  - Added integration test for enterprise learner upsert/query flow.
  - Re-ran contract freeze report and reduced unmatched count to 5.

### Phase 15: Unmatched API Family Migration (`consent`)
- **Status:** in_progress
- Actions taken:
  - Added consent domain and `/consent/api/v1/data_sharing_consent` API.
  - Added in-memory and JDBC repositories.
  - Added Flyway migration `V8__data_sharing_consent.sql`.
  - Added enterprise/consent root API endpoints for legacy root path compatibility.
  - Re-ran contract freeze report and reduced unmatched count to 3.

### Phase 16: Unmatched API Family Migration (`taxonomy`)
- **Status:** in_progress
- Actions taken:
  - Added taxonomy learner current job domain and API.
  - Added in-memory and JDBC repositories.
  - Added Flyway migration `V9__learner_current_job.sql`.
  - Added `/api/v1` root compatibility endpoint.
  - Re-ran contract freeze report and reduced unmatched count to 1 (external endpoint only).

### Phase 17: 1:1 Compatibility Closure (`zendesk`)
- **Status:** in_progress
- Actions taken:
  - Added zendesk compatibility domain:
    - `POST /zendesk_proxy/v0`
    - `POST /zendesk_proxy/v1`
    - `POST /api/v2/tickets.json`
  - Added compatibility service with payload shape validation and status-code aligned behavior.
  - Added lightweight in-memory rate limiter (50 requests/hour window).
  - Added configuration entries for Zendesk URL/OAuth token.
  - Added integration tests for invalid payload (`400`) and unconfigured upstream (`503`).
  - Re-ran `backend-java/scripts/freeze-contracts.sh` and reached `matched=8/unmatched=0`.

### Phase 18: Networked Build Validation
- **Status:** in_progress
- Actions taken:
  - Ran `mvn -Dmaven.repo.local=/tmp/.m2 test` with network-enabled dependency download.
  - Detected 3 failures and fixed them:
    - Enterprise API trailing slash compatibility (`/enterprise/api/v1/enterprise-learner/`)
    - Taxonomy API trailing slash compatibility (`/taxonomy/api/v1/learners-current-job/`)
    - Invalid JSON escaping in job orchestrator test payload
  - Re-ran tests and verified all pass.

### Phase 19: Agreements API Migration
- **Status:** in_progress
- Actions taken:
  - Added agreements domain implementation and compatibility API endpoints:
    - `GET/POST /api/agreements/v1/integrity_signature/{courseId}`
    - `POST /api/agreements/v1/lti_pii_signature/{courseId}`
  - Added in-memory repositories and service layer for integrity/lti-pii signatures.
  - Added feature toggles in config:
    - `app.agreements.enable-integrity-signature`
    - `app.agreements.enable-lti-pii-acknowledgement`
  - Added integration tests for agreements behavior:
    - self get/post, staff cross-user access, non-staff forbidden
    - invalid lti payload returns 500, valid payload upsert returns 200
  - Ran full Maven tests successfully.
  - Fixed contract endpoint exporter to parse array-style mapping annotations (e.g. `@GetMapping({"", "/"})`) and regenerated coverage artifacts.

### Phase 20: Bookmarks API Migration
- **Status:** in_progress
- Actions taken:
  - Added bookmarks domain with in-memory repository and service.
  - Added compatibility endpoints:
    - `GET/POST /api/bookmarks/v1/bookmarks/`
    - `GET/DELETE /api/bookmarks/v1/bookmarks/{username},{usage_id}/`
  - Added compatibility error payload for bookmark-specific failures (`developer_message/user_message`).
  - Added list pagination response fields and basic filtering (`course_id`, `fields`, `page_size`, `page`).
  - Added integration tests for create/list/get/delete and invalid input paths.
  - Fixed NPE in list response caused by `Map.of` with nullable `next/previous`.
  - Re-ran Maven tests and contract freeze successfully.

### Phase 21: Course Experience API v1 Migration
- **Status:** in_progress
- Actions taken:
  - Added course experience service and compatibility controller for:
    - `POST /api/course_experience/v1/reset_course_deadlines`
    - `POST /api/course_experience/v1/reset_all_course_deadlines/`
    - `GET /api/course_experience/v1/course_deadlines_info/{courseKey}`
  - Added enrollment repository `findByUser` for reset-all workflow (inmemory + jdbc).
  - Added integration tests for:
    - reset deadlines required param validation (`400`)
    - reset deadlines success (`200`)
    - reset-all success response
    - mobile deadlines unauthorized (`401`), unknown course (`404`), known course (`200`)
  - Fixed test regression (wrong HTTP method on enrollment setup call).
  - Re-ran Maven tests and contract freeze successfully.

### Phase 22: Language Preference Compatibility
- **Status:** in_progress
- Actions taken:
  - Added language preference service/controller:
    - `PATCH /lang_pref/update_language`
    - `GET/POST /update_lang/`
  - Added cookie update behavior for language preference endpoint (`Set-Cookie`).
  - Added preview language in-memory state for `update_lang` compatibility.
  - Added integration tests for:
    - language patch response cookie
    - update_lang unauthenticated (`401`)
    - update_lang authenticated GET (`200`)
    - update_lang set action POST redirect (`302`)
  - Re-ran Maven tests and contract freeze successfully.

### Phase 23: Toggle State API Compatibility
- **Status:** in_progress
- Actions taken:
  - Added toggle state compatibility endpoint `GET /api/toggles/v0/state/`.
  - Enforced staff-only semantics and returned report-compatible payload shape.
  - Extended integration tests and verified pass.

### Phase 24: Legacy/User Compatibility Sweep + Contract Closure
- **Status:** in_progress
- Actions taken:
  - Added `LegacyCompatibilityController` endpoints for remaining frontend-discovered path families:
    - commerce/content-staging/contentstore/courses/credit/enrollment/entitlements/financial/profile_images/team/help_center/uploads.
  - Added `UserCompatController` + service for `/api/user/v0|v1/...` compatibility endpoints.
  - Updated frontend API discovery script to better handle template string trailing noise.
  - Updated contract coverage normalization for `${...}` variables and partial concatenation artifacts.
  - Added `src/test/resources/mockito-extensions/org.mockito.plugins.MockMaker` with `mock-maker-subclass` to fix JDK 25 inline-mock attach failures.
  - Re-ran contract freeze: `frontend=42`, `matched=42`, `unmatched=0`.
  - Re-ran `mvn -Dmaven.repo.local=/tmp/.m2 test`: `Tests run: 27, Failures: 0, Errors: 0`.
  - Added compatibility endpoint `GET /api/toggles/v0/state/`.
  - Added staff-only enforcement based on auth roles (`STAFF/ADMIN/GLOBAL_STAFF`).
  - Added response payload shape with `django_settings` and `waffle_flags`.
  - Added integration tests for non-staff forbidden and staff success.
  - Re-ran Maven tests and contract freeze successfully.

## Test Results (Latest)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Contract freeze | `backend-java/scripts/freeze-contracts.sh` | API coverage refreshed | `matched=8/unmatched=0` | PASS |
| Maven tests (rerun) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | Spring tests execute | `Tests run: 18, Failures: 0, Errors: 0` | PASS |
| Maven tests (agreements) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | New agreements tests pass | `Tests run: 20, Failures: 0, Errors: 0` | PASS |
| Maven tests (bookmarks) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | New bookmarks tests pass | `Tests run: 22, Failures: 0, Errors: 0` | PASS |
| Maven tests (course_experience) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | New course_experience tests pass | `Tests run: 24, Failures: 0, Errors: 0` | PASS |
| Maven tests (lang_pref/dark_lang compat) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | New language compatibility tests pass | `Tests run: 25, Failures: 0, Errors: 0` | PASS |
| Maven tests (toggles compat) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | New toggle-state tests pass | `Tests run: 26, Failures: 0, Errors: 0` | PASS |
