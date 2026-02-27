package org.openedx.backend.course.infra;

import org.openedx.backend.course.domain.CourseMetadata;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
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
}
