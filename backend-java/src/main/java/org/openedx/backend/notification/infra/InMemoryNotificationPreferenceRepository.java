package org.openedx.backend.notification.infra;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.openedx.backend.notification.domain.NotificationPreference;
import org.springframework.stereotype.Repository;

@Repository
public class InMemoryNotificationPreferenceRepository implements NotificationPreferenceRepository {

    private final ConcurrentMap<String, NotificationPreference> store = new ConcurrentHashMap<>();

    @Override
    public Optional<NotificationPreference> findByUserId(String userId) {
        return Optional.ofNullable(store.get(userId));
    }

    @Override
    public NotificationPreference save(NotificationPreference preference) {
        store.put(preference.userId(), preference);
        return preference;
    }
}
