package org.openedx.backend.consent.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertDataSharingConsentRequest(
        @NotBlank
        @Size(max = 128)
        String username,
        boolean consented
) {
}
