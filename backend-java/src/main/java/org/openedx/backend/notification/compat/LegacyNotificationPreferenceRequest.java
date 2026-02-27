package org.openedx.backend.notification.compat;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public record LegacyNotificationPreferenceRequest(
        @JsonProperty("email_enabled")
        @NotNull Boolean emailEnabled,
        @JsonProperty("sms_enabled")
        @NotNull Boolean smsEnabled
) {
}
