#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"

echo "[smoke] health"
curl -fsSL "${BASE_URL}/api/v1/health" >/dev/null

echo "[smoke] users"
curl -fsSL \
  -H "X-User-Id: smoke-user" \
  -H "X-Permissions: identity:user:list" \
  "${BASE_URL}/api/v1/users?page=0&size=1" >/dev/null

echo "[smoke] courses"
curl -fsSL \
  -H "X-User-Id: smoke-user" \
  -H "X-Permissions: course:list" \
  "${BASE_URL}/api/v1/courses/list?page=0&size=1" >/dev/null

echo "[smoke] jobs"
curl -fsSL \
  -H "X-User-Id: smoke-user" \
  -H "X-Permissions: job:list" \
  "${BASE_URL}/api/v1/jobs?page=0&size=1" >/dev/null

echo "[smoke] OK"
