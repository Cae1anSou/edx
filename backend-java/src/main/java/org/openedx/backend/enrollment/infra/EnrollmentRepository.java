package org.openedx.backend.enrollment.infra;

import java.util.Optional;
import java.util.List;

import org.openedx.backend.enrollment.domain.EnrollmentRecord;

public interface EnrollmentRepository {

    Optional<EnrollmentRecord> find(String userId, String courseId);

    List<EnrollmentRecord> findByUser(String userId);

    EnrollmentRecord save(EnrollmentRecord enrollmentRecord);
}
