package org.openedx.backend.grading.api;

import java.time.Instant;

public record GradeResponse(
        String userId,
        String courseId,
        double score,
        String letterGrade,
        Instant updatedAt
) {
}
