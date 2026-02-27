package org.openedx.backend.enterprise.infra;

import org.openedx.backend.enterprise.domain.EnterpriseLearnerRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.enterprise.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryEnterpriseLearnerRepository implements EnterpriseLearnerRepository {

    private final ConcurrentMap<String, EnterpriseLearnerRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<EnterpriseLearnerRecord> findByUsername(String username) {
        return Optional.ofNullable(store.get(username));
    }

    @Override
    public EnterpriseLearnerRecord save(EnterpriseLearnerRecord record) {
        store.put(record.username(), record);
        return record;
    }

    @Override
    public List<EnterpriseLearnerRecord> list(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(EnterpriseLearnerRecord::updatedAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    @Override
    public long count() {
        return store.size();
    }
}
