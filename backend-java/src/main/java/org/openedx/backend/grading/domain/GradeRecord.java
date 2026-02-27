package org.openedx.backend.grading.domain;

import java.time.Instant;

public record GradeRecord(
        String userId,
        String courseId,
        double score,
        String letterGrade,
        Instant updatedAt
) {
}
