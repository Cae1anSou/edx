package org.openedx.backend.notification.infra.idempotency;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(name = "app.notification.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryNotificationIdempotencyRepository implements NotificationIdempotencyRepository {

    private final ConcurrentHashMap<String, String> keyOwners = new ConcurrentHashMap<>();

    @Override
    public String findOwner(String idempotencyKey) {
        return keyOwners.get(idempotencyKey);
    }

    @Override
    public boolean saveIfAbsent(String idempotencyKey, String userId) {
        return keyOwners.putIfAbsent(idempotencyKey, userId) == null;
    }
}
