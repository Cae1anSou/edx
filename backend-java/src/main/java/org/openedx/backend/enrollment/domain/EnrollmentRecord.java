package org.openedx.backend.enrollment.domain;

import java.time.Instant;

public record EnrollmentRecord(
        String userId,
        String courseId,
        String status,
        Instant enrolledAt,
        Instant updatedAt
) {
}
