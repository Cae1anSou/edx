package org.openedx.backend.agreements.infra;

import org.openedx.backend.agreements.domain.IntegritySignatureRecord;

import java.util.Optional;

public interface IntegritySignatureRepository {
    Optional<IntegritySignatureRecord> find(String username, String courseId);

    IntegritySignatureRecord save(IntegritySignatureRecord record);
}
