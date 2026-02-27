package org.openedx.backend.agreements.domain;

import java.time.Instant;

public record IntegritySignatureRecord(
        String username,
        String courseId,
        Instant createdAt
) {
}
