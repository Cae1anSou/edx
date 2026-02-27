# Spring-only Cutover Checklist

## Goal
Use Spring Boot backend as the only runtime path and remove Django runtime dependency for the new system.

## Pre-cutover
1. Confirm all required APIs are implemented in `backend-java`.
2. Ensure Flyway migrations `V1` to `V5` run successfully on target DB.
3. Validate auth headers and AOP permissions in end-to-end tests.
4. Export and archive OpenAPI contracts:
   - `openapi-platform.json`
   - `openapi-identity-course.json`
   - `openapi-learning.json`
5. Verify no frontend call still points to Django-only endpoints.

## Startup
1. `cd backend-java`
2. `./scripts/start-spring-only.sh`
3. Check health: `curl http://localhost:8080/api/v1/health`
4. Confirm Swagger groups:
   - `/v3/api-docs/platform`
   - `/v3/api-docs/identity-course`
   - `/v3/api-docs/learning`

## Contract export
1. `cd backend-java`
2. `./scripts/export-openapi.sh`
3. Check generated files under `backend-java/contracts/`.

## Smoke tests
1. User register/get/list.
2. Course upsert/get/list.
3. Enrollment flow.
4. Learning progress flow.
5. Grading flow.
6. Certificate issue/get/revoke.
7. Job submit/get/list and `run-once`.

## Post-cutover
1. Lock deployment pipeline to Spring-only artifacts.
2. Mark Django runtime services as deprecated.
3. Track remaining Django code cleanup as non-runtime debt.
