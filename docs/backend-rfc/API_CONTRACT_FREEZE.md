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
- Spring endpoints indexed: 25
- Frontend-discovered API paths: 8
- Matched: 7
- Unmatched: 1

Key unmatched examples:
- `/api/v2/tickets.json`

## Interpretation
The current unmatched paths indicate remaining legacy API families not yet implemented in Spring contract surface.  
These should be migrated or explicitly retired before Django runtime decommission.

## Next Actions
1. Prioritize unmatched families by business criticality (`enterprise`, `consent`, `taxonomy`, `coursexs`).
2. Add Spring controller modules for each required family.
3. Re-run contract freeze and require unmatched count trend to decrease in CI.
