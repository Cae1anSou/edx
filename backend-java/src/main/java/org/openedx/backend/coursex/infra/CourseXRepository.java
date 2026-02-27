package org.openedx.backend.coursex.infra;

import org.openedx.backend.coursex.domain.CourseXRecord;

import java.util.List;
import java.util.Optional;

public interface CourseXRepository {

    Optional<CourseXRecord> findByCourseXId(String courseXId);

    CourseXRecord save(CourseXRecord record);

    List<CourseXRecord> list(int page, int size);

    long count();
}
