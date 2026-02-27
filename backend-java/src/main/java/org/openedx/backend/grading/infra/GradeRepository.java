package org.openedx.backend.grading.infra;

import org.openedx.backend.grading.domain.GradeRecord;

import java.util.Optional;

public interface GradeRepository {

    Optional<GradeRecord> find(String userId, String courseId);

    GradeRecord save(GradeRecord gradeRecord);
}
