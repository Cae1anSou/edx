package org.openedx.backend.learningprogress.infra;

import org.openedx.backend.learningprogress.domain.LearningProgress;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.learning-progress.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryLearningProgressRepository implements LearningProgressRepository {

    private final ConcurrentMap<String, LearningProgress> store = new ConcurrentHashMap<>();

    @Override
    public Optional<LearningProgress> find(String userId, String courseId) {
        return Optional.ofNullable(store.get(key(userId, courseId)));
    }

    @Override
    public LearningProgress save(LearningProgress progress) {
        store.put(key(progress.userId(), progress.courseId()), progress);
        return progress;
    }

    private String key(String userId, String courseId) {
        return userId + "::" + courseId;
    }
}
