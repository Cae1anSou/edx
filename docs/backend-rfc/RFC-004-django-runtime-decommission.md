# RFC-004: Django Runtime Decommission Plan

- Status: Draft
- Date: 2026-02-27
- Owner: Backend Refactor Team

## 1. Objective

Retire Django runtime services and keep only Spring Boot backend in deployment/runtime topology.

## 2. Scope

In scope:
- Remove LMS/CMS runtime deployment jobs from release pipeline.
- Keep source code temporarily for fallback analysis (no runtime traffic).
- Move API ownership to Spring OpenAPI contracts.

Out of scope:
- Immediate deletion of all Django source files.
- Historical migration cleanup in a single step.

## 3. Runtime Cut Sequence

1. Freeze Django runtime changes.
2. Deploy Spring-only stack.
3. Run smoke checks against Spring endpoints.
4. Disable Django service startup in runtime environments.
5. Archive Django runtime logs and configs.

## 4. Exit Criteria

1. All required frontend calls resolve against Spring APIs.
2. Contract files exported from Spring and versioned.
3. Spring health, job orchestration, and core learning flows pass smoke checks.
4. Django runtime process is not started in target environment.

## 5. Follow-up

1. Remove Django-specific deployment manifests from active pipelines.
2. Create codebase cleanup epics for dead Django modules.
