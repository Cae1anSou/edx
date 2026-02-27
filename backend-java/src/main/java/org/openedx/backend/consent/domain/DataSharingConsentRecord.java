package org.openedx.backend.consent.domain;

import java.time.Instant;

public record DataSharingConsentRecord(
        String username,
        boolean consented,
        Instant updatedAt
) {
}
