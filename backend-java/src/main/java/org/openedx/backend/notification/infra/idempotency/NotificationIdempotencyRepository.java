package org.openedx.backend.notification.infra.idempotency;

public interface NotificationIdempotencyRepository {

    boolean exists(String idempotencyKey);

    void save(String idempotencyKey, String userId);
}
