package org.openedx.backend.learningprogress.api;

import java.time.Instant;

public record LearningProgressResponse(
        String userId,
        String courseId,
        int progressPercent,
        boolean completed,
        Instant updatedAt
) {
}
