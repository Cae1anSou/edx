package org.openedx.backend.learningprogress.infra;

import org.openedx.backend.learningprogress.domain.LearningProgress;

import java.util.Optional;

public interface LearningProgressRepository {

    Optional<LearningProgress> find(String userId, String courseId);

    LearningProgress save(LearningProgress progress);
}
