package org.openedx.backend.joborchestrator.domain;

import java.time.Instant;

public record JobRecord(
        String jobId,
        String jobType,
        String payload,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
