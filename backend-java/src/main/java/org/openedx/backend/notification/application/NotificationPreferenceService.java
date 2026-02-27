package org.openedx.backend.notification.application;

import java.time.Instant;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.notification.domain.NotificationPreference;
import org.openedx.backend.notification.infra.NotificationPreferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository repository;

    public NotificationPreferenceService(NotificationPreferenceRepository repository) {
        this.repository = repository;
    }

    public NotificationPreference getByUserId(String userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new DomainNotFoundException("Notification preference not found for user: " + userId));
    }

    public NotificationPreference upsert(String userId, boolean emailEnabled, boolean smsEnabled) {
        NotificationPreference updated = new NotificationPreference(userId, emailEnabled, smsEnabled, Instant.now());
        return repository.save(updated);
    }
}
