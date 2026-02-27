#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"

echo "[smoke-frontend] health"
curl -fsSL "${BASE_URL}/api/v1/health" >/dev/null

echo "[smoke-frontend] registration validation"
curl -fsSL \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"username":"smoke-user","email":"smoke@example.com"}' \
  "${BASE_URL}/api/user/v1/validation/registration" >/dev/null

echo "[smoke-frontend] user account list (compat)"
curl -fsSL \
  -H "X-User-Id: smoke-user" \
  "${BASE_URL}/api/user/v1/accounts/" >/dev/null

echo "[smoke-frontend] enterprise learner list (permission-gated)"
curl -fsSL \
  -H "X-User-Id: smoke-user" \
  -H "X-Permissions: enterprise:learner:read" \
  "${BASE_URL}/enterprise/api/v1/enterprise-learner/?page=0&size=1" >/dev/null

echo "[smoke-frontend] bookmarks list"
curl -fsSL \
  -H "X-User-Id: smoke-user" \
  "${BASE_URL}/api/bookmarks/v1/bookmarks/?page=1&page_size=1" >/dev/null

echo "[smoke-frontend] toggles (staff role)"
curl -fsSL \
  -H "X-User-Id: staff-user" \
  -H "X-Roles: STAFF" \
  "${BASE_URL}/api/toggles/v0/state/" >/dev/null

echo "[smoke-frontend] OK"
