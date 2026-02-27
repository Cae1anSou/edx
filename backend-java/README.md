# backend-java

Open edX 后端 Java 重构的 Phase 0 基础工程。

## 当前包含
- Spring Boot 基础工程
- 统一错误响应与 `X-Request-Id` 追踪
- 健康检查接口
- 通知偏好示例域（内存实现）
- OpenAPI 文档 (`/swagger-ui.html`)

## 本地运行
```bash
cd backend-java
mvn spring-boot:run
```

### JDBC 模式（开启 Flyway）
```bash
cd backend-java
mvn spring-boot:run -Dspring-boot.run.profiles=jdbc
```

## 关键接口
- `GET /api/v1/health`
- `POST /api/v1/users`
- `GET /api/v1/users/{userId}`
- `PUT /api/v1/courses/{courseId}`
- `GET /api/v1/courses/{courseId}`
- `PUT /api/v1/courses/{courseId}/enrollments/{userId}`
- `GET /api/v1/courses/{courseId}/enrollments/{userId}`
- `DELETE /api/v1/courses/{courseId}/enrollments/{userId}`
- `PUT /api/v1/courses/{courseId}/progress/{userId}`
- `GET /api/v1/courses/{courseId}/progress/{userId}`
- `PUT /api/v1/courses/{courseId}/grades/{userId}`
- `GET /api/v1/courses/{courseId}/grades/{userId}`
- `POST /api/v1/courses/{courseId}/certificates/{userId}`
- `GET /api/v1/courses/{courseId}/certificates/{userId}`
- `DELETE /api/v1/courses/{courseId}/certificates/{userId}`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs/{jobId}`
- `PUT /api/v1/jobs/{jobId}/running`
- `PUT /api/v1/jobs/{jobId}/succeeded`
- `PUT /api/v1/jobs/{jobId}/failed`
- `GET /api/v1/notification-preferences/{userId}`
- `PUT /api/v1/notification-preferences/{userId}`
- `GET /api/legacy/users/{userId}/notification-preferences`
- `PUT /api/legacy/users/{userId}/notification-preferences`

## 配置说明
- `app.notification.repository=inmemory`（默认）
- `app.notification.repository=jdbc`（`jdbc` profile 自动设置）
- `app.course.repository=inmemory|jdbc`
- `app.identity.repository=inmemory|jdbc`
- `app.enrollment.repository=inmemory|jdbc`
- `app.learning-progress.repository=inmemory|jdbc`
- `app.grading.repository=inmemory|jdbc`
- `app.certificate.repository=inmemory|jdbc`
- `app.job-orchestrator.repository=inmemory|jdbc`

## 约定
- `PUT` 接口支持请求头 `X-Idempotency-Key`，用于幂等更新。
- 通知偏好更新后会产生日志事件（后续可替换为 Kafka publisher）。
- 当前目标是直接由 Spring 承载核心 API，不再依赖 Django 灰度切流。
- 统一响应格式：`{ code, message, data, error }`。
- AOP 鉴权头：
  - `X-User-Id`
  - `X-Roles`（逗号分隔）
  - `X-Permissions`（逗号分隔）
  - `X-Research-Groups`（逗号分隔）
