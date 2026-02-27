package org.openedx.backend.consent.infra;

import org.openedx.backend.consent.domain.DataSharingConsentRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.consent.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryDataSharingConsentRepository implements DataSharingConsentRepository {

    private final ConcurrentMap<String, DataSharingConsentRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<DataSharingConsentRecord> findByUsername(String username) {
        return Optional.ofNullable(store.get(username));
    }

    @Override
    public DataSharingConsentRecord save(DataSharingConsentRecord record) {
        store.put(record.username(), record);
        return record;
    }
}
