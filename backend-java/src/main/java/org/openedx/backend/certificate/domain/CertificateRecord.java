package org.openedx.backend.certificate.domain;

import java.time.Instant;

public record CertificateRecord(
        String userId,
        String courseId,
        String status,
        String certificateUrl,
        Instant issuedAt,
        Instant updatedAt
) {
}
