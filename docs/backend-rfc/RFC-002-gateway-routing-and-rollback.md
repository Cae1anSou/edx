# RFC-002: 网关灰度路由与回退策略（Django -> Java）

- Status: Draft
- Date: 2026-02-27
- Owner: Backend Refactor Team
- Related:
  - `BACKEND_REFACTOR_PLAN.md`
  - `docs/backend-rfc/RFC-001-domain-boundary-wave1.md`

## 1. 目标

在不影响前端与用户流程的前提下，让同一 API 能按策略路由到 Django 或 Java，并支持分钟级回退。

## 2. 路由策略

网关匹配顺序：
1. 显式 Header 开关：`X-Backend-Target: java|django`
2. URI 白名单：Wave-1 仅放行通知偏好接口
3. 用户分群：按 `user_id` 哈希灰度（1% -> 10% -> 50% -> 100%）

默认后端仍为 Django。Java 仅对灰度命中的请求生效。

## 3. 首批路由清单

### 标准路径
- `GET /api/v1/notification-preferences/{userId}`
- `PUT /api/v1/notification-preferences/{userId}`

### 兼容路径
- `GET /api/legacy/users/{userId}/notification-preferences`
- `PUT /api/legacy/users/{userId}/notification-preferences`

## 4. 一致性与安全

1. `PUT` 请求必须透传 `X-Idempotency-Key`，避免重试造成重复写入。
2. 网关透传 `X-Request-Id`，便于跨系统排障。
3. Java 侧写入后产生日志事件；后续升级为 Kafka 后保持同名事件模型。

## 5. 回退机制

### 触发条件（任一满足）
- Java 路由命中接口错误率高于 Django 基线 2 倍且持续 5 分钟
- P95 延迟劣化超过 30% 且持续 10 分钟
- 数据核对任务出现 P1 级别不一致

### 回退动作
1. 网关配置切换：命中规则全部回到 Django
2. 保留 Java 实例用于排障，不立即下线
3. 启动回退审计：导出该窗口请求与响应摘要

目标：5 分钟内恢复到全 Django 路由。

## 6. 观测与看板

必须提供按路由目标分组的指标：
- QPS
- 错误率（4xx/5xx）
- P95/P99
- 幂等命中率（相同 key 的重复请求）

## 7. 验收标准

1. 可按 Header 强制切流到 Java 或 Django。
2. 能按用户分群比例灰度切流。
3. 一键回退可在 5 分钟内恢复到 Django 全量承载。
