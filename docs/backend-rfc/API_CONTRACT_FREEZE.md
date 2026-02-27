# API Contract Freeze (Spring-only)

## Goal
Freeze and version Spring API contracts, and continuously compare against frontend-discovered API paths to identify Django-only leftovers.

## Artifacts
- `backend-java/contracts/spring-endpoints.txt`
- `backend-java/contracts/frontend-api-paths.txt`
- `backend-java/contracts/coverage-report.md`

## Refresh Commands
```bash
cd backend-java
./scripts/freeze-contracts.sh
```

## Current Snapshot (2026-02-27)
- Spring endpoints indexed: 36
- Frontend-discovered API paths: 8
- Matched: 8
- Unmatched: 0

## Interpretation
Current frontend-discovered API paths are fully covered by Spring contract surface.  
Contract freeze can now be used as a regression gate during continued 1:1 behavior migration.

## Next Actions
1. Keep `freeze-contracts.sh` in CI and fail build on any new unmatched path.
2. Continue deep behavior-level migration (payload semantics, status codes, edge-case parity), not just path presence.
3. Expand frontend path discovery scope (runtime logs + JS bundles) to reduce static-scan blind spots.
