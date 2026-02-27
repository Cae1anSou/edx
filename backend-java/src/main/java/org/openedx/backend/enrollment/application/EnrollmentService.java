package org.openedx.backend.enrollment.application;

import java.time.Instant;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.enrollment.domain.EnrollmentRecord;
import org.openedx.backend.enrollment.infra.EnrollmentRepository;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {

    private final EnrollmentRepository repository;
    private final DomainEventPublisher eventPublisher;

    public EnrollmentService(EnrollmentRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public EnrollmentRecord get(String userId, String courseId) {
        return repository.find(userId, courseId)
                .orElseThrow(() -> new DomainNotFoundException("Enrollment not found"));
    }

    public EnrollmentRecord enroll(String userId, String courseId) {
        Instant now = Instant.now();
        EnrollmentRecord record = new EnrollmentRecord(
                userId,
                courseId,
                "ENROLLED",
                now,
                now
        );
        repository.save(record);
        eventPublisher.publish("EnrollmentChanged userId=" + userId + " courseId=" + courseId + " status=ENROLLED");
        return record;
    }

    public EnrollmentRecord unenroll(String userId, String courseId) {
        EnrollmentRecord current = repository.find(userId, courseId)
                .orElseThrow(() -> new DomainNotFoundException("Enrollment not found"));
        EnrollmentRecord updated = new EnrollmentRecord(
                current.userId(),
                current.courseId(),
                "UNENROLLED",
                current.enrolledAt(),
                Instant.now()
        );
        repository.save(updated);
        eventPublisher.publish("EnrollmentChanged userId=" + userId + " courseId=" + courseId + " status=UNENROLLED");
        return updated;
    }
}
