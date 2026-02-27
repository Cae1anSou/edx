package org.openedx.backend.course.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.course.domain.CourseMetadata;
import org.openedx.backend.course.infra.CourseMetadataRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class CourseMetadataService {

    private final CourseMetadataRepository repository;
    private final DomainEventPublisher eventPublisher;

    public CourseMetadataService(CourseMetadataRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public CourseMetadata get(String courseId) {
        return repository.findByCourseId(courseId)
                .orElseThrow(() -> new DomainNotFoundException("Course not found"));
    }

    public CourseMetadata upsert(String courseId, String title, String status, String ownerUserId) {
        CourseMetadata metadata = new CourseMetadata(courseId, title, status, ownerUserId, Instant.now());
        repository.save(metadata);
        eventPublisher.publish("CourseMetadataUpdated courseId=" + courseId + " status=" + status);
        return metadata;
    }
}
