package org.openedx.backend.agreements.infra;

import org.openedx.backend.agreements.domain.IntegritySignatureRecord;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryIntegritySignatureRepository implements IntegritySignatureRepository {

    private final ConcurrentHashMap<String, IntegritySignatureRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<IntegritySignatureRecord> find(String username, String courseId) {
        return Optional.ofNullable(store.get(key(username, courseId)));
    }

    @Override
    public IntegritySignatureRecord save(IntegritySignatureRecord record) {
        store.put(key(record.username(), record.courseId()), record);
        return record;
    }

    private String key(String username, String courseId) {
        return username + "::" + courseId;
    }
}
