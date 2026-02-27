package org.openedx.backend.notification.infra;

import java.util.Optional;

import org.openedx.backend.notification.domain.NotificationPreference;

public interface NotificationPreferenceRepository {

    Optional<NotificationPreference> findByUserId(String userId);

    NotificationPreference save(NotificationPreference preference);
}
