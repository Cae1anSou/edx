package org.openedx.backend.identity.domain;

import java.time.Instant;

public record UserProfile(
        String userId,
        String email,
        String displayName,
        Instant createdAt,
        Instant updatedAt
) {
}
