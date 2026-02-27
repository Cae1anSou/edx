package org.openedx.backend.notification.infra.idempotency;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(name = "app.notification.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryNotificationIdempotencyRepository implements NotificationIdempotencyRepository {

    private final Set<String> keys = ConcurrentHashMap.newKeySet();

    @Override
    public boolean exists(String idempotencyKey) {
        return keys.contains(idempotencyKey);
    }

    @Override
    public void save(String idempotencyKey, String userId) {
        keys.add(idempotencyKey);
    }
}
