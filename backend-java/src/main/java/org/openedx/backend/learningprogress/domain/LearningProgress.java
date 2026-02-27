package org.openedx.backend.learningprogress.domain;

import java.time.Instant;

public record LearningProgress(
        String userId,
        String courseId,
        int progressPercent,
        boolean completed,
        Instant updatedAt
) {
}
