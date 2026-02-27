package org.openedx.backend.enterprise.api;

import java.time.Instant;

public record EnterpriseLearnerResponse(
        String username,
        String enterpriseId,
        boolean active,
        Instant updatedAt
) {
}
