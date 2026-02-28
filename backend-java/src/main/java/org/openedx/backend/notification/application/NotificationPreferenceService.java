package org.openedx.backend.notification.application;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.exception.BusinessException;
import org.openedx.backend.notification.domain.NotificationPreference;
import org.openedx.backend.notification.domain.event.NotificationPreferenceChangedEvent;
import org.openedx.backend.notification.infra.idempotency.NotificationIdempotencyRepository;
import org.openedx.backend.notification.infra.NotificationPreferenceRepository;
import org.springframework.http.HttpStatus;
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
        if (StringUtils.hasText(idempotencyKey)) {
            String owner = idempotencyRepository.findOwner(idempotencyKey);
            if (owner != null) {
                if (!owner.equals(userId)) {
                    throw new BusinessException(
                            "IDEMPOTENCY_KEY_CONFLICT",
                            "X-Idempotency-Key is already bound to a different user",
                            HttpStatus.CONFLICT
                    );
                }
                return repository.findByUserId(userId)
                        .orElseThrow(() -> new DomainNotFoundException("Notification preference not found for user: " + userId));
            }

            boolean reserved = idempotencyRepository.saveIfAbsent(idempotencyKey, userId);
            if (!reserved) {
                String currentOwner = idempotencyRepository.findOwner(idempotencyKey);
                if (userId.equals(currentOwner)) {
                    return repository.findByUserId(userId)
                            .orElseThrow(() -> new DomainNotFoundException("Notification preference not found for user: " + userId));
                }
                throw new BusinessException(
                        "IDEMPOTENCY_KEY_CONFLICT",
                        "X-Idempotency-Key is already bound to a different user",
                        HttpStatus.CONFLICT
                );
            }
        }

        NotificationPreference updated = new NotificationPreference(userId, emailEnabled, smsEnabled, Instant.now());
        NotificationPreference saved = repository.save(updated);

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
