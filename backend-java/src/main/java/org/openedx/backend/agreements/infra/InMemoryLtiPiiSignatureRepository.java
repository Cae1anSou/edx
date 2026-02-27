package org.openedx.backend.agreements.infra;

import org.openedx.backend.agreements.domain.LtiPiiSignatureRecord;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryLtiPiiSignatureRepository implements LtiPiiSignatureRepository {

    private final ConcurrentHashMap<String, LtiPiiSignatureRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<LtiPiiSignatureRecord> find(String username, String courseId) {
        return Optional.ofNullable(store.get(key(username, courseId)));
    }

    @Override
    public LtiPiiSignatureRecord save(LtiPiiSignatureRecord record) {
        store.put(key(record.username(), record.courseId()), record);
        return record;
    }

    private String key(String username, String courseId) {
        return username + "::" + courseId;
    }
}
