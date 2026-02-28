# Progress Log

> Historical note (split branch): As of 2026-02-28, top-level `lms/` and `cms/` directories were removed from this branch. Prior log entries referencing those paths describe earlier migration states.

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
| Maven tests (legacy/user compat sweep) | `cd backend-java && mvn -Dmaven.repo.local=/tmp/.m2 test` | Legacy/user compatibility tests pass | `Tests run: 27, Failures: 0, Errors: 0` | PASS |

## Session: 2026-02-28 (Frontend Decoupling Completion)

### Phase 26: Frontend Compatibility Closure
- **Status:** in_progress
- Actions taken:
  - Completed legacy notification compatibility on React side:
    - Added `v2` preferences fetch.
    - Added one-click update GET/POST and optional patch variant support.
  - Expanded team-management query compatibility:
    - Added `email/username/user_id` search inputs.
    - Added teams `expand` and membership `admin` query handling.
  - Closed SPA route parity gaps by adding:
    - `/course/:courseKey`
    - `/rerun/`
    - `/rerun/:sourceCourseKey/`
  - Added automated parity script:
    - `backend-java/scripts/check-spa-route-parity.py`
  - Updated docs:
    - `frontend-app-studio-dashboard/README.md`
    - `backend-java/README.md`

## Test Results (Frontend Decoupling)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| SPA route parity | `python3 backend-java/scripts/check-spa-route-parity.py` | No missing frontend routes | `backend routes: 32`, `frontend routes: 32`, passed | PASS |
| Frontend install/build | `npm install && npm run build` (frontend-app-studio-dashboard) | Build succeeds | `esbuild spawnSync EPERM` in current sandbox | BLOCKED |

## Error Log (Frontend Decoupling)
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-02-28 | `npm install` failed at `esbuild` with `EPERM` | 1 | Switched to static API/route parity verification and documented blocked full build |

### Phase 26 Scope Verification (LMS/CMS)
- **Status:** in_progress
- Actions taken:
  - Scanned repository structure and confirmed `lms/` and `cms/` currently only contain `static/` resources.
  - Verified absence of Django page-layer sources (`views.py`, `urls.py`, `templates/`) within this snapshot.
  - Marked full LMS/CMS page migration as blocked by missing source scope in this repository.

### Phase 26 Legacy Source Pull from master
- **Status:** in_progress
- Actions taken:
  - Pulled migration reference sources from `master` into `migration-reference/master`:
    - `cms/urls.py`, `lms/urls.py`
    - key templates (`course-create-rerun`, `manage_users`, `library`, `videos_index`, `lms/dashboard`)
    - CMS JS entry files (`main.js`, `require-config.js`)
  - Added route-alias migration mappings for legacy CMS paths to React pages.
  - Extended backend SPA route controller and React router to support legacy aliases.
  - Added `migration-reference/FRONTEND_MIGRATION_MAP.md` to track source->target mapping.
| Maven tests (after legacy route alias migration) | `cd backend-java && mvn test -q` | All tests pass after controller route expansion | PASS | PASS |

### Phase 26 Legacy LMS Entry Migration
- **Status:** in_progress
- Actions taken:
  - Added LMS entry page `LmsDashboardPage` and routed `/dashboard` to React.
  - Added LMS course route aliases `/courses`, `/courses/:coursePath`, `/courses/*`.
  - Expanded backend SPA carrier routes for LMS aliases (`/dashboard`, `/courses/...`).
  - Added legacy-path param seeding to React pages:
    - `InstructorToolsPage` (`courseKey`)
    - `TeamsV0Page` (`courseKey/groupConfigurationId/groupId`)
    - `UploadsPage` (`courseKey/edxVideoId`)
    - `LearnerExperiencePage` (`coursePath/*`)
    - `ResourceBuilderPage` (`courseKey`)

## Test Results (LMS Entry Migration)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| SPA route parity | `python3 backend-java/scripts/check-spa-route-parity.py` | Backend routes covered in frontend | Passed (51 backend routes covered) | PASS |
| Backend regression | `cd backend-java && mvn test -q` | No test regressions | Passed | PASS |

### Phase 26 Legacy Courses View-Level Migration
- **Status:** in_progress
- Actions taken:
  - Reworked `/courses/*` handling from generic fallback to view-aware page logic.
  - Added `LegacyCoursesPage` view detection and data loading by legacy sub-path:
    - `about`, `courseware`, `progress`, `instructor`, `discussion`, `bookmarks`.
  - Added in-page legacy navigation between sub-views for a detected course key.
  - Added enrollment action in `about` view (`Enroll Current Course`) for course-scoped routes.

## Test Results (Legacy Courses View-Level)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| SPA route parity | `python3 backend-java/scripts/check-spa-route-parity.py` | no backend route missing in frontend | Passed | PASS |
| Backend regression | `cd backend-java && mvn test -q` | no backend regressions | Passed | PASS |

### Phase 26 Legacy Courses Deepening
- **Status:** in_progress
- Actions taken:
  - Added view-specific parsing fields for courseware/progress routes (`section/subsection/position`, `studentId`).
  - Added per-view data loading and controls for `/courses/*`:
    - progress user selector
    - instructor `problem_location_str` filter
    - in-page subview navigation links
  - Added `fetchLearningProgress(courseId, userId)` API client and wired it into progress view.
  - Added additional LMS legacy alias shell page and route aliases (`course_modes`, `verify_student`, `support`, `wiki`).

## Test Results (Legacy Courses Deepening)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| SPA route parity | `python3 backend-java/scripts/check-spa-route-parity.py` | backend routes covered | Passed (`backend routes: 55`) | PASS |
| Backend regression | `cd backend-java && mvn test -q` | no regressions | Passed | PASS |
### Phase 26: Legacy Route-to-Page Deepening (2026-02-28, continued)
- Added backend SPA compatibility aliases for additional legacy entry shapes:
  - Trailing slash variants (`/course/{key}/`, `/team/{key}/`, `/course_team/.../`, `/courses/{path}/`, `/library/{key}/team/`).
  - Root entries for LMS/CMS families (`/course_modes`, `/verify_student`, `/support`, `/wiki`, `/search`, `/catalog`, `/api-admin`, `/howitworks/`, `/signin_redirect_to_lms/`, `/request_course_creator/`, `/signin`, `/signup`, `/accessibility`, `/status`).
- Avoided regression by **not** mapping `/update_lang/` root to SPA (keeps backend language-preview endpoint behavior).
- React route migration deepening:
  - Re-mapped many legacy paths from generic shell pages to concrete React pages.
  - LMS: `course_modes/verify_student/api-admin -> IdentityAccessPage`, `support -> HelpCenterPage`, `search/catalog -> SearchCommercePage`, `wiki -> LearnerExperiencePage`.
  - CMS: `import/export/checklists -> CourseOperationsPage`, `container/container_embed/orphan/tabs/textbooks -> ContentstorePage`, `video_images -> UploadsPage`, `howitworks/signin_redirect_to_lms/request_course_creator/signin/signup -> DashboardPage`, `accessibility/status -> SystemStatusPage`.
### Phase 26: Legacy Context Seeding + Help Route Migration (2026-02-28, continued)
- Replaced `/help_token*` route target from legacy shell to concrete `HelpCenterPage`.
- Added route-context seeding for legacy URLs:
  - `CourseOperationsPage`: auto-detects course key from `/import* /export* /checklists*` legacy paths and pre-fills payload.
  - `ContentstorePage`: auto-detects course key/block key from `/tabs* /textbooks* /container* /container_embed* /orphan*` paths.
  - `HelpCenterPage`: auto-seeds query from `/support/*` and `/help_token/*` paths.
  - `SearchCommercePage`: auto-seeds `course_id/user` from query params.
  - `IdentityAccessPage`: now displays current legacy path context.
- Further reduced shell-route usage:
  - `/update_lang/*` now mapped to `IdentityAccessPage`.
  - `/help_token*` mapped to `HelpCenterPage`.
### Phase 26.3: Video/Transcript Legacy Flow Migration (2026-02-28)
- Expanded Uploads migration scope from generic upload token flow to legacy video/transcript surface:
  - Added API clients for `generate_video_upload_link`, `video_images_upload_enabled`, `video_features`, `transcript_preferences`, `transcript_credentials`, `video_encodings_download`.
  - `UploadsPage` now supports these operations and displays their responses.
- Added deep-link context seeding in `UploadsPage` from legacy paths:
  - `/videos/*`, `/video_images/*`, `/generate_video_upload_link/*`, `/transcript_*`, `/video_encodings_download/*`.
- Added frontend routes and backend SPA carrier routes for transcript/video legacy endpoints, including trailing-slash variants.
- Validation:
  - Route parity check passed (`backend routes: 99`).
  - Backend Maven tests passed.
### Phase 26.4: CMS Legacy Authoring Entry Expansion (2026-02-28)
- Added route migration for additional CMS legacy entries:
  - `course_info`, `course_info_update`, `course_notifications`, `course/<key>/search_reindex`
  - `xblock/*` authoring views
  - `transcripts/*` utility actions
- Mapped these routes to existing React pages (`ResourceBuilderPage`, `NotificationsCenterPage`, `CourseOperationsPage`, `ContentstorePage`, `UploadsPage`).
- Updated page context behavior:
  - `CourseOperationsPage` now extracts course key from `search_reindex` path.
  - `ContentstorePage` now seeds block key from `xblock/*` routes.
  - `NotificationsCenterPage` now shows current legacy route context.
- Validation passed: SPA route parity and backend Maven tests.
### Phase 26.5: Legacy Error/Org + LMS Deep-Link Parsing (2026-02-28)
- Added migration routes for legacy org/error entries:
  - `/organizations` -> `IdentityAccessPage`
  - `/not_found`, `/server_error`, `/403`, `/404`, `/429`, `/500` -> `SystemStatusPage`
  - plus `/accessibility/` trailing slash alias.
- Added backend SPA carrier support for the same route set.
- Enhanced `LegacyCoursesPage` deep-link parser:
  - `jump_to` / `jump_to_id` now treated as courseware route context.
  - `course_wiki` / `wiki` now mapped to discussion view context.
- Validation passed: parity + backend tests.
### Phase 26.6: Identity Route Semantics Improvement (2026-02-28)
- Improved `IdentityAccessPage` behavior for legacy `course_modes*` routes:
  - Detects `course_modes` path family and loads `/api/course_modes/v1/` response in-page.
- This reduces generic landing behavior for identity routes and aligns content with legacy intent.
- Validation passed: route parity + backend tests.
### Phase 26.7: Slashful Course-Key Compatibility (2026-02-28)
- Added wildcard route aliases for legacy paths where course keys can be slash-delimited (`org/course/run`):
  - `course_info*`, `course_info_update*`, `course_notifications*`,
  - `generate_video_upload_link*`, `transcript_preferences*`, `transcript_credentials*`, `video_encodings_download*`.
- Implemented path-based course-key parsing (including slashful keys) in:
  - `ResourceBuilderPage`, `NotificationsCenterPage`, `UploadsPage`, `CourseOperationsPage`, `ContentstorePage`, `TeamManagementPage`, `TeamsV0Page`.
- Validation passed: parity + backend tests.
### Phase 26.8: Route-Aware Auto-Execution Improvements (2026-02-28)
- `HelpCenterPage`: for `support/help_token` seeded routes, auto-runs one search request after seeding query.
- `SearchCommercePage`: for `search/catalog` entry routes, auto-runs legacy search when seeded params exist.
- `LearnerExperiencePage`: improved course-key parsing for slashful and `course-v1` styles and shows current path.
- Validation passed: route parity + backend tests.
### Phase 26.9: XBlock/Transcript Route Hardening (2026-02-28)
- Added trailing-slash aliases for `/transcripts/*` in frontend routes and backend SPA carrier routes.
- Added wildcard frontend aliases for xblock paths:
  - `/xblock/*`, `/xblock/container/*`, `/xblock/outline/*`.
- Improved `ContentstorePage` path parsing to preserve full block/usage keys instead of truncating at first segment.
- Validation passed: route parity + backend tests.
### Phase 26.10: LMS Tail Entry Migration (2026-02-28)
- Added legacy LMS entries to SPA migration map and routes:
  - `/change_enrollment` -> `LearnerServicesPage`
  - `/notify*` -> `LearnerExperiencePage`
  - `/rss_proxy*` -> `PlatformIntegrationsPage`
- Added backend SPA carrier support for the same routes.
- Enhanced `LearnerServicesPage` route awareness:
  - reads `course_id` from query string and pre-fills enrollment/financial payload.
  - displays current path and seeded course key.
- Validation passed: parity + backend tests.
### Phase 26.11: Notify/RSS Root Route Closure (2026-02-28)
- Added root route coverage for `/notify` and `/rss_proxy` in both React router and Spring SPA carrier.
- Improved route observability:
  - `LearnerExperiencePage` now shows notify subpath context.
  - `PlatformIntegrationsPage` now shows rss-proxy subpath context.
- Validation passed: parity + backend tests.
### Phase 26.12: Dashboard Subroute + Search-Reindex Legacy Shape (2026-02-28)
- Added dashboard subroute compatibility:
  - frontend `/dashboard/*` -> `LmsDashboardPage`
  - backend SPA carrier `/dashboard/{dashboardPath:.+}` (+ trailing slash)
- Added old-style search-reindex route compatibility:
  - frontend `/course/:org/:number/:run/search_reindex` (+ trailing slash) -> `CourseOperationsPage`
- `LmsDashboardPage` now shows current path for legacy subroute observability.
- Validation passed: parity + backend tests.
### Phase 26.13: Notify/RSS Trailing-Slash Hardening (2026-02-28)
- Added explicit trailing-slash subpath route aliases for `notify` and `rss_proxy` in frontend router.
- Added matching trailing-slash SPA carrier routes in Spring controller.
- Updated migration map notes for optional trailing slash behavior.
- Validation passed: parity + backend tests.
### Phase 26.14: Internal SPA Entry Slash Compatibility (2026-02-28)
- Added trailing-slash aliases for core migrated React entry routes on both frontend and backend carrier, including:
  - notifications, notification-preferences, help-center, user-tours, mfe-branding,
  - legacy-compatibility, api-families, teams-v0, uploads, contentstore,
  - learner-services, instructor-tools, legacy-system-apis, course-operations,
  - learner-experience, platform-integrations, search-commerce,
  - authoring-apis, identity-access, compliance, system-status,
  - notifications-center, resource-builder.
- Fixed a transient route-array syntax issue in `StudioDashboardFrontendController` and revalidated.
- Validation passed: parity + backend tests.
### Phase 26.15: Old-Style Search-Reindex Backend Closure (2026-02-28)
- Added explicit backend SPA carrier aliases for old-style search_reindex route:
  - `/course/{org}/{number}/{run}/search_reindex` (+ trailing slash).
- Enhanced `DashboardPage` route observability:
  - shows current path and parsed legacy course key for `/course/*` entries.
- Updated migration mapping note to indicate old-style course-key support.
- Validation passed: parity + backend tests.
### Phase 26.16: Authoring/System Route Subpath Support (2026-02-28)
- Added frontend subpath aliases:
  - `/authoring-apis/*`
  - `/legacy-system-apis/*`
- Added backend SPA carrier aliases:
  - `/authoring-apis/{authoringPath:.+}`
  - `/legacy-system-apis/{systemPath:.+}`
- Enhanced page-level context:
  - `AuthoringApisPage` now parses route and displays legacy course key from `/settings/advanced/*` or `/authoring-apis/*`.
  - `LegacySystemApisPage` now displays current path.
- Validation passed: parity + backend tests.
### Phase 26.17: Signin/Signup Slash + Dashboard Subpath UX (2026-02-28)
- Added `/signin/` and `/signup/` aliases in both frontend router and backend SPA carrier.
- Enhanced `LmsDashboardPage` with dashboard subpath context display for `/dashboard/*` entries.
- Updated migration map to state optional trailing slash for signin/signup entries.
- Validation passed: parity + backend tests.
### Phase 26.18: Parameterized Route Slash Backfill (2026-02-28)
- Backfilled backend SPA carrier trailing-slash aliases for parameterized routes already supported by frontend:
  - rerun/course_rerun source-key variants,
  - tasks,
  - videos,
  - group_configurations,
  - settings/details|grading|advanced.
- This closes URL normalization mismatches between frontend and backend carrier layers.
- Validation passed: parity + backend tests.
### Phase 26.19: Wildcard Route Context Parsing Backfill (2026-02-28)
- Improved page-level path parsing for wildcard-matched legacy routes:
  - `InstructorToolsPage` now parses course/grader from `/settings/grading/*`.
  - `ResourceBuilderPage` now parses course from `/settings/details/*`.
  - `TeamManagementPage` now parses course from `/team/*` when params are absent.
- These fixes close context-loss cases where routes enter via wildcard aliases.
- Validation passed: parity + backend tests.
### Phase 26.20: Legacy Tail Route Sweep (2026-02-28)
- Added remaining legacy entry aliases from `master` references in both frontend router and backend SPA carrier:
  - identity/lang: `/lang_pref/update_language`
  - status/util: `/event`, `/calculate`
  - content authoring: `/preview/xblock/*`, `/xblock/resource/*`
  - operations/compliance: `/export_git/*`, `/course/*/entrance_exam`, `/certificates/*`
  - authoring doc endpoints: `/authoring-api/ui`, `/authoring-api/schema`
- Updated migration map with these route families.
- Validation passed: parity + backend tests.

## Session: 2026-02-28 (Release Readiness Validation)

### Phase 27: Go/No-Go Validation
- **Status:** in_progress
- Actions taken:
  - Added Vite API proxy for local BFF integration:
    - [vite.config.ts](/machine/Learning/Code/edx/frontend-app-studio-dashboard/vite.config.ts)
    - [vite.config.js](/machine/Learning/Code/edx/frontend-app-studio-dashboard/vite.config.js)
  - Added expanded release E2E script:
    - [release-readiness-e2e.ts](/machine/Learning/Code/edx/frontend-app-studio-dashboard/e2e/release-readiness-e2e.ts)
  - Executed backend regression:
    - `backend-java mvn test` (PASS)
    - `backend-java mvn test -Dspring.profiles.active=jdbc` (PASS)
  - Executed frontend regression:
    - `frontend-app-studio-dashboard npm run build` (PASS)
  - Executed contract freeze:
    - `backend-java/scripts/freeze-contracts.sh` (PASS, unmatched=0)
  - Executed expanded headless E2E:
    - routes `/course|/dashboard|/system-status` + auth/write/error branches (PASS)
  - Executed pre-prod smoke validation:
    - `smoke-spring-only.sh` (PASS)
    - `smoke-frontend-compat.sh` (PASS)

## Test Results (Release Readiness)
| Test | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Backend regression | `backend-java mvn test` | All tests pass | `39/0/0` | PASS |
| Backend JDBC/Flyway regression | `backend-java mvn test -Dspring.profiles.active=jdbc` | All tests pass with JDBC profile | `39/0/0` | PASS |
| Frontend build | `frontend-app-studio-dashboard npm run build` | Build succeeds | Vite build success | PASS |
| Contract coverage | `backend-java/scripts/freeze-contracts.sh` | Unmatched paths = 0 | `Unmatched: 0` | PASS |
| Expanded headless E2E | `node --experimental-strip-types e2e/release-readiness-e2e.ts` | all checks pass | all checks passed | PASS |
| Pre-prod smoke | `smoke-spring-only.sh` + `smoke-frontend-compat.sh` | all checks pass | both scripts OK | PASS |
| Root JS unit tests | `npm run test-jest` | Jest suite runs | `jest: command not found` + install issues | BLOCKED |

## Error Log (Release Readiness)
| Timestamp | Error | Attempt | Resolution |
|-----------|-------|---------|------------|
| 2026-02-28 | `vite.config.ts` used `process.env` without Node types | 1 | Switched to `loadEnv` in Vite config |
| 2026-02-28 | TS compile for E2E script failed from workspace type noise | 1 | Used `node --experimental-strip-types` to execute TS script directly |
| 2026-02-28 | `npm run test-jest` failed (`jest` missing) | 1 | Tried `npm install`; blocked by legacy npm/toolchain issues |
| 2026-02-28 | Root `npm install` failed with cache permission and npm CLI exit-handler error | 2 | Used project-safe cache path; still blocked, recorded as environment blocker |

### Phase 27.1: Root Jest Regression Unblocked (2026-02-28)
- Used RAN + pnpm to install root dependencies successfully.
- Command: `pnpm install --frozen-lockfile`
- Command: `npm run test-jest -- --runInBand`
- Result: `Test Suites: 1 passed, Tests: 3 passed`.

### Phase 27.2: Contract/E2E Tooling Accuracy Hardening (2026-02-28)
- Fixed Spring endpoint export parsing to preserve class-level `@RequestMapping` base path when extra annotations exist before class declaration.
- Re-generated endpoint index and contract coverage report:
  - `Spring endpoints indexed: 277`
  - `Frontend-discovered API paths: 84`
  - `Matched: 76`
  - `Unmatched: 0`
  - `Unresolved template expressions: 0`
- Fixed template normalization to handle dangling `${suffix|query|problemQuery` fragments.
- Hardened frontend E2E execution model:
  - Removed `@ts-nocheck` from E2E TS scripts.
  - Added `tsconfig.e2e.json`.
  - Added scripts:
    - `npm --prefix frontend-app-studio-dashboard run e2e:build`
    - `npm --prefix frontend-app-studio-dashboard run e2e:headless`
    - `npm --prefix frontend-app-studio-dashboard run e2e:release`
  - Added local Node type shims for restricted-network compile stability.
- Validation:
  - `npm --prefix frontend-app-studio-dashboard run e2e:build` PASS
  - `npm --prefix frontend-app-studio-dashboard run build` PASS
