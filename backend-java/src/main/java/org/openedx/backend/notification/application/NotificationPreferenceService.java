package org.openedx.backend.notification.application;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.notification.domain.NotificationPreference;
import org.openedx.backend.notification.domain.event.NotificationPreferenceChangedEvent;
import org.openedx.backend.notification.infra.idempotency.NotificationIdempotencyRepository;
import org.openedx.backend.notification.infra.NotificationPreferenceRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository repository;
    private final NotificationIdempotencyRepository idempotencyRepository;
    private final DomainEventPublisher eventPublisher;

    public NotificationPreferenceService(
            NotificationPreferenceRepository repository,
            NotificationIdempotencyRepository idempotencyRepository,
            DomainEventPublisher eventPublisher
    ) {
        this.repository = repository;
        this.idempotencyRepository = idempotencyRepository;
        this.eventPublisher = eventPublisher;
    }

    public NotificationPreference getByUserId(String userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new DomainNotFoundException("Notification preference not found for user: " + userId));
    }

    public NotificationPreference upsert(String userId, boolean emailEnabled, boolean smsEnabled, String idempotencyKey) {
        if (StringUtils.hasText(idempotencyKey) && idempotencyRepository.exists(idempotencyKey)) {
            return repository.findByUserId(userId)
                    .orElseThrow(() -> new DomainNotFoundException("Notification preference not found for user: " + userId));
        }

        NotificationPreference updated = new NotificationPreference(userId, emailEnabled, smsEnabled, Instant.now());
        NotificationPreference saved = repository.save(updated);

        if (StringUtils.hasText(idempotencyKey)) {
            try {
                idempotencyRepository.save(idempotencyKey, userId);
            } catch (DuplicateKeyException ignored) {
                // Another concurrent request with the same idempotency key already persisted the marker.
            }
        }

        eventPublisher.publish(new NotificationPreferenceChangedEvent(
                UUID.randomUUID().toString(),
                saved.userId(),
                saved.emailEnabled(),
                saved.smsEnabled(),
                Optional.ofNullable(idempotencyKey).orElse(""),
                saved.updatedAt()
        ));
        return saved;
    }
}
