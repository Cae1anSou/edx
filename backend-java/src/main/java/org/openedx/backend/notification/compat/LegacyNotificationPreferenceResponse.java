package org.openedx.backend.notification.compat;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LegacyNotificationPreferenceResponse(
        @JsonProperty("user_id")
        String userId,
        @JsonProperty("email_enabled")
        boolean emailEnabled,
        @JsonProperty("sms_enabled")
        boolean smsEnabled,
        @JsonProperty("updated_at")
        Instant updatedAt
) {
}
