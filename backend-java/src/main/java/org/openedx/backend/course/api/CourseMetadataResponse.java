package org.openedx.backend.course.api;

import java.time.Instant;

public record CourseMetadataResponse(
        String courseId,
        String title,
        String status,
        String ownerUserId,
        Instant updatedAt
) {
}
