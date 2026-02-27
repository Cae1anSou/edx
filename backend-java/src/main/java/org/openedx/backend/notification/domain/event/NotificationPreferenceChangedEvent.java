package org.openedx.backend.notification.domain.event;

import java.time.Instant;

public record NotificationPreferenceChangedEvent(
        String eventId,
        String userId,
        boolean emailEnabled,
        boolean smsEnabled,
        String idempotencyKey,
        Instant occurredAt
) {
}
