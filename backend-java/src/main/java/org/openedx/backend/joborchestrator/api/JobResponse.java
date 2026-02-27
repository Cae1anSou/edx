package org.openedx.backend.joborchestrator.api;

import java.time.Instant;

public record JobResponse(
        String jobId,
        String jobType,
        String payload,
        String status,
        Instant createdAt,
        Instant updatedAt
) {
}
