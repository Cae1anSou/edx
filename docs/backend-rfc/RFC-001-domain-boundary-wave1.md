# RFC-001: Java 后端域边界与首批迁移范围

- Status: Draft
- Date: 2026-02-27
- Owner: Backend Refactor Team
- Related: `BACKEND_REFACTOR_PLAN.md`

## 1. 背景

当前后端为 Django/Open edX 单体，耦合高且涉及异步任务、事件与多数据源。为降低一次性重写风险，采用 Strangler 渐进替换策略，需要先冻结首批域边界与 API 迁移清单。

## 2. 决策

1. Java 主干采用“模块化单体”形态启动，短期不拆微服务。
2. 首批迁移域（Wave-1）选择低风险能力：
   - 通知偏好（notification preference）
   - 轻量健康与观测接口
3. 建立双路径 API：
   - 标准新路径：`/api/v1/...`
   - 兼容旧路径：`/api/legacy/...`
4. 数据访问策略采用可切换仓储：
   - 默认 `inmemory`（便于本地开发）
   - `jdbc` profile 用于接入真实数据库与 Flyway

## 3. 边界定义

### In Scope (Wave-1)
- 通知偏好查询与更新（用户级别）
- 全局错误响应格式
- 请求追踪头 `X-Request-Id`
- 健康检查接口

### Out of Scope (Wave-1)
- 课程结构与 modulestore 迁移
- 选课/成绩/证书核心链路
- Celery 任务对等迁移

## 4. API 契约（首批）

### 新路径
- `GET /api/v1/health`
- `GET /api/v1/notification-preferences/{userId}`
- `PUT /api/v1/notification-preferences/{userId}`

### 兼容路径
- `GET /api/legacy/users/{userId}/notification-preferences`
- `PUT /api/legacy/users/{userId}/notification-preferences`

兼容路径返回 snake_case 字段，用于降低网关切流初期改造成本。

## 5. 数据模型（Wave-1）

表：`notification_preference`
- `user_id` (PK)
- `email_enabled` (bool)
- `sms_enabled` (bool)
- `updated_at` (timestamp)

迁移脚本通过 Flyway 管理。

## 6. 风险与缓解

1. 风险：新旧接口语义偏差  
   缓解：同一 service 层提供逻辑，adapter 仅做字段映射。
2. 风险：切到 JDBC 后出现环境配置差异  
   缓解：保留 `inmemory` 默认；`jdbc` 以 profile 控制并在 CI 验证。
3. 风险：早期缺少真实流量验证  
   缓解：在网关按用户分群灰度，逐步放量并保留 Django 回退。

## 7. 验收标准

1. `inmemory` 与 `jdbc` 两种模式下接口行为一致。
2. 标准路径与兼容路径均可读写并返回统一业务结果。
3. 错误响应含统一 `code/message/requestId`。

## 8. 后续动作

1. RFC-002：API 网关路由策略（Header/URI/用户分群）。
2. RFC-003：双写与对账框架（针对核心域）。
