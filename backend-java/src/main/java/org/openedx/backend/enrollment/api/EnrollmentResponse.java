package org.openedx.backend.enrollment.api;

import java.time.Instant;

public record EnrollmentResponse(
        String userId,
        String courseId,
        String status,
        Instant enrolledAt,
        Instant updatedAt
) {
}
