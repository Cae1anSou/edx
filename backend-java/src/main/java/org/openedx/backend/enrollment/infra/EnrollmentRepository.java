package org.openedx.backend.enrollment.infra;

import java.util.Optional;

import org.openedx.backend.enrollment.domain.EnrollmentRecord;

public interface EnrollmentRepository {

    Optional<EnrollmentRecord> find(String userId, String courseId);

    EnrollmentRecord save(EnrollmentRecord enrollmentRecord);
}
