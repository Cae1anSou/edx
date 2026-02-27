package org.openedx.backend.coursex.api;

import java.time.Instant;

public record CourseXResponse(
        String courseXId,
        String parentCourseId,
        String displayName,
        String ownerUserId,
        Instant createdAt,
        Instant updatedAt
) {
}
