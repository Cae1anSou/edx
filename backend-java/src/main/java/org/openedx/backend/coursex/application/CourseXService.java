package org.openedx.backend.coursex.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.coursex.domain.CourseXRecord;
import org.openedx.backend.coursex.infra.CourseXRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class CourseXService {

    private final CourseXRepository repository;
    private final DomainEventPublisher eventPublisher;

    public CourseXService(CourseXRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public CourseXRecord get(String courseXId) {
        return repository.findByCourseXId(courseXId)
                .orElseThrow(() -> new DomainNotFoundException("CourseX not found"));
    }

    public CourseXRecord create(String parentCourseId, String displayName, String ownerUserId) {
        Instant now = Instant.now();
        CourseXRecord record = new CourseXRecord(
                "coursex-" + UUID.randomUUID(),
                parentCourseId,
                displayName,
                ownerUserId,
                now,
                now
        );
        repository.save(record);
        eventPublisher.publish("CourseXCreated coursexId=" + record.courseXId());
        return record;
    }

    public PageResponse<CourseXRecord> list(int page, int size) {
        return new PageResponse<>(
                repository.list(page, size),
                page,
                size,
                repository.count()
        );
    }
}
