# Project Structure

This repository is now organized around a frontend/backend split.

## Active application layers

- `backend-java/`: Spring Boot backend, database migrations, API contracts, and backend smoke tools.
- `frontend-app-studio-dashboard/`: standalone React + Vite + TypeScript Studio Dashboard MFE.

## Supporting layers

- `docs/`: architecture decisions, RFCs, and technical references.
- `migration-reference/`: migration snapshots and branch comparison materials.
- `scripts/`: shared repository-level build/test helper scripts.

## Legacy static assets kept during migration

- `common/static/`
- `xmodule/static/`, `xmodule/js/`, `xmodule/assets/`

These legacy directories remain only for compatibility while migration work continues.
All new backend business/API logic should go into `backend-java/`.
All new dashboard frontend pages and E2E tests should go into `frontend-app-studio-dashboard/`.

## Working conventions

- Backend APIs: add/modify in `backend-java/src/` and keep contract checks in `backend-java/contracts/` green.
- Frontend routes/pages: add in `frontend-app-studio-dashboard/src/`.
- Frontend E2E: add in `frontend-app-studio-dashboard/e2e/`.
- Do not commit generated artifacts (`dist/`, `e2e-dist/`, `*.tsbuildinfo`, generated `vite.config.js/.d.ts`).
