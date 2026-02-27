package org.openedx.backend.notification.domain;

import java.time.Instant;

public record NotificationPreference(
        String userId,
        boolean emailEnabled,
        boolean smsEnabled,
        Instant updatedAt
) {
}
