package org.openedx.backend.consent.api;

import java.time.Instant;

public record DataSharingConsentResponse(
        String username,
        boolean consented,
        Instant updatedAt
) {
}
