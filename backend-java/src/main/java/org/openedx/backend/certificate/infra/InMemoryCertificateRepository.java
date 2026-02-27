package org.openedx.backend.certificate.infra;

import org.openedx.backend.certificate.domain.CertificateRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.certificate.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryCertificateRepository implements CertificateRepository {

    private final ConcurrentMap<String, CertificateRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<CertificateRecord> find(String userId, String courseId) {
        return Optional.ofNullable(store.get(key(userId, courseId)));
    }

    @Override
    public CertificateRecord save(CertificateRecord certificateRecord) {
        store.put(key(certificateRecord.userId(), certificateRecord.courseId()), certificateRecord);
        return certificateRecord;
    }

    private String key(String userId, String courseId) {
        return userId + "::" + courseId;
    }
}
