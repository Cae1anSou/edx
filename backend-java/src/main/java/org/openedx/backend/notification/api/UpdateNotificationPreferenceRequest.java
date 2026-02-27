package org.openedx.backend.notification.api;

import jakarta.validation.constraints.NotNull;

public record UpdateNotificationPreferenceRequest(
        @NotNull Boolean emailEnabled,
        @NotNull Boolean smsEnabled
) {
}
