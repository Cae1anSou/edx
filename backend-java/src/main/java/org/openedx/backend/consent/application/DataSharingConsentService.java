package org.openedx.backend.consent.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.consent.domain.DataSharingConsentRecord;
import org.openedx.backend.consent.infra.DataSharingConsentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class DataSharingConsentService {

    private final DataSharingConsentRepository repository;
    private final DomainEventPublisher eventPublisher;

    public DataSharingConsentService(DataSharingConsentRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public DataSharingConsentRecord get(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new DomainNotFoundException("Consent not found"));
    }

    public DataSharingConsentRecord upsert(String username, boolean consented) {
        DataSharingConsentRecord record = new DataSharingConsentRecord(username, consented, Instant.now());
        repository.save(record);
        eventPublisher.publish("ConsentUpdated username=" + username + " consented=" + consented);
        return record;
    }
}
