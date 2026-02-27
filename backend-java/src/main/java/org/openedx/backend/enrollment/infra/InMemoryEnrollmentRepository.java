package org.openedx.backend.enrollment.infra;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.openedx.backend.enrollment.domain.EnrollmentRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(name = "app.enrollment.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryEnrollmentRepository implements EnrollmentRepository {

    private final ConcurrentMap<String, EnrollmentRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<EnrollmentRecord> find(String userId, String courseId) {
        return Optional.ofNullable(store.get(key(userId, courseId)));
    }

    @Override
    public List<EnrollmentRecord> findByUser(String userId) {
        List<EnrollmentRecord> out = new ArrayList<>();
        for (EnrollmentRecord row : store.values()) {
            if (row.userId().equals(userId)) {
                out.add(row);
            }
        }
        return out;
    }

    @Override
    public EnrollmentRecord save(EnrollmentRecord enrollmentRecord) {
        store.put(key(enrollmentRecord.userId(), enrollmentRecord.courseId()), enrollmentRecord);
        return enrollmentRecord;
    }

    private String key(String userId, String courseId) {
        return userId + "::" + courseId;
    }
}
