package org.openedx.backend.grading.infra;

import org.openedx.backend.grading.domain.GradeRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.grading.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryGradeRepository implements GradeRepository {

    private final ConcurrentMap<String, GradeRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<GradeRecord> find(String userId, String courseId) {
        return Optional.ofNullable(store.get(key(userId, courseId)));
    }

    @Override
    public GradeRecord save(GradeRecord gradeRecord) {
        store.put(key(gradeRecord.userId(), gradeRecord.courseId()), gradeRecord);
        return gradeRecord;
    }

    private String key(String userId, String courseId) {
        return userId + "::" + courseId;
    }
}
