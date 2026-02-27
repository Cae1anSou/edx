package org.openedx.backend.taxonomy.api;

import java.time.Instant;

public record LearnerCurrentJobResponse(
        String username,
        String company,
        String jobTitle,
        Instant updatedAt
) {
}
