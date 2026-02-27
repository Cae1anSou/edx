package org.openedx.backend.taxonomy.domain;

import java.time.Instant;

public record LearnerCurrentJobRecord(
        String username,
        String company,
        String jobTitle,
        Instant updatedAt
) {
}
