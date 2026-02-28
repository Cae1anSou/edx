package org.openedx.backend.notification.infra.idempotency;

public interface NotificationIdempotencyRepository {

    String findOwner(String idempotencyKey);

    boolean saveIfAbsent(String idempotencyKey, String userId);
}
