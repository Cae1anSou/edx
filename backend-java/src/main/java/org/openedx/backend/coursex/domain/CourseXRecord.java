package org.openedx.backend.coursex.domain;

import java.time.Instant;

public record CourseXRecord(
        String courseXId,
        String parentCourseId,
        String displayName,
        String ownerUserId,
        Instant createdAt,
        Instant updatedAt
) {
}
