package org.openedx.backend.enterprise.domain;

import java.time.Instant;

public record EnterpriseLearnerRecord(
        String username,
        String enterpriseId,
        boolean active,
        Instant updatedAt
) {
}
