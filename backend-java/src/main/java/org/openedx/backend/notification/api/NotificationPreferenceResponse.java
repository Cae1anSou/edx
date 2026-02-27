package org.openedx.backend.notification.api;

import java.time.Instant;

public record NotificationPreferenceResponse(
        String userId,
        boolean emailEnabled,
        boolean smsEnabled,
        Instant updatedAt
) {
}
