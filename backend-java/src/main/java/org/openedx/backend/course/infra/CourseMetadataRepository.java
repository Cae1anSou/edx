package org.openedx.backend.course.infra;

import org.openedx.backend.course.domain.CourseMetadata;

import java.util.List;
import java.util.Optional;

public interface CourseMetadataRepository {

    Optional<CourseMetadata> findByCourseId(String courseId);

    CourseMetadata save(CourseMetadata metadata);

    List<CourseMetadata> list(int page, int size);

    long count();
}
