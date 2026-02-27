package org.openedx.backend.enterprise.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.enterprise.domain.EnterpriseLearnerRecord;
import org.openedx.backend.enterprise.infra.EnterpriseLearnerRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class EnterpriseLearnerService {

    private final EnterpriseLearnerRepository repository;
    private final DomainEventPublisher eventPublisher;

    public EnterpriseLearnerService(EnterpriseLearnerRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public EnterpriseLearnerRecord getByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new DomainNotFoundException("Enterprise learner not found"));
    }

    public EnterpriseLearnerRecord upsert(String username, String enterpriseId, boolean active) {
        EnterpriseLearnerRecord record = new EnterpriseLearnerRecord(
                username,
                enterpriseId,
                active,
                Instant.now()
        );
        repository.save(record);
        eventPublisher.publish("EnterpriseLearnerUpdated username=" + username);
        return record;
    }

    public PageResponse<EnterpriseLearnerRecord> list(int page, int size) {
        return new PageResponse<>(
                repository.list(page, size),
                page,
                size,
                repository.count()
        );
    }
}
