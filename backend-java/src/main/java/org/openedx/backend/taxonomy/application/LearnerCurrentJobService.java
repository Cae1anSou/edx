package org.openedx.backend.taxonomy.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.taxonomy.domain.LearnerCurrentJobRecord;
import org.openedx.backend.taxonomy.infra.LearnerCurrentJobRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class LearnerCurrentJobService {

    private final LearnerCurrentJobRepository repository;
    private final DomainEventPublisher eventPublisher;

    public LearnerCurrentJobService(LearnerCurrentJobRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public LearnerCurrentJobRecord get(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new DomainNotFoundException("Learner current job not found"));
    }

    public LearnerCurrentJobRecord upsert(String username, String company, String jobTitle) {
        LearnerCurrentJobRecord record = new LearnerCurrentJobRecord(username, company, jobTitle, Instant.now());
        repository.save(record);
        eventPublisher.publish("LearnerCurrentJobUpdated username=" + username);
        return record;
    }

    public PageResponse<LearnerCurrentJobRecord> list(int page, int size) {
        return new PageResponse<>(
                repository.list(page, size),
                page,
                size,
                repository.count()
        );
    }
}
