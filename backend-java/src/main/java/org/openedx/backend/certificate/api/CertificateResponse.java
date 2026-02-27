package org.openedx.backend.certificate.api;

import java.time.Instant;

public record CertificateResponse(
        String userId,
        String courseId,
        String status,
        String certificateUrl,
        Instant issuedAt,
        Instant updatedAt
) {
}
