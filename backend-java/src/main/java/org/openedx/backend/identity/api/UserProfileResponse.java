package org.openedx.backend.identity.api;

import java.time.Instant;

public record UserProfileResponse(
        String userId,
        String email,
        String displayName,
        Instant createdAt,
        Instant updatedAt
) {
}
