package org.openedx.backend.course.infra;

import org.openedx.backend.course.domain.CourseMetadata;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.course.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryCourseMetadataRepository implements CourseMetadataRepository {

    private final ConcurrentMap<String, CourseMetadata> store = new ConcurrentHashMap<>();

    @Override
    public Optional<CourseMetadata> findByCourseId(String courseId) {
        return Optional.ofNullable(store.get(courseId));
    }

    @Override
    public CourseMetadata save(CourseMetadata metadata) {
        store.put(metadata.courseId(), metadata);
        return metadata;
    }

    @Override
    public List<CourseMetadata> list(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(CourseMetadata::updatedAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    @Override
    public long count() {
        return store.size();
    }
}
