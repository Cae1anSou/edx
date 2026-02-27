package org.openedx.backend.taxonomy.infra;

import org.openedx.backend.taxonomy.domain.LearnerCurrentJobRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.taxonomy.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryLearnerCurrentJobRepository implements LearnerCurrentJobRepository {

    private final ConcurrentMap<String, LearnerCurrentJobRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<LearnerCurrentJobRecord> findByUsername(String username) {
        return Optional.ofNullable(store.get(username));
    }

    @Override
    public LearnerCurrentJobRecord save(LearnerCurrentJobRecord record) {
        store.put(record.username(), record);
        return record;
    }

    @Override
    public List<LearnerCurrentJobRecord> list(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(LearnerCurrentJobRecord::updatedAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    @Override
    public long count() {
        return store.size();
    }
}
