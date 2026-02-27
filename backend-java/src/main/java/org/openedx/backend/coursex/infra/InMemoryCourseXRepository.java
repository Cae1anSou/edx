package org.openedx.backend.coursex.infra;

import org.openedx.backend.coursex.domain.CourseXRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.coursex.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryCourseXRepository implements CourseXRepository {

    private final ConcurrentMap<String, CourseXRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<CourseXRecord> findByCourseXId(String courseXId) {
        return Optional.ofNullable(store.get(courseXId));
    }

    @Override
    public CourseXRecord save(CourseXRecord record) {
        store.put(record.courseXId(), record);
        return record;
    }

    @Override
    public List<CourseXRecord> list(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(CourseXRecord::createdAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    @Override
    public long count() {
        return store.size();
    }
}
