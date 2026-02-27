package org.openedx.backend.course.domain;

import java.time.Instant;

public record CourseMetadata(
        String courseId,
        String title,
        String status,
        String ownerUserId,
        Instant updatedAt
) {
}
