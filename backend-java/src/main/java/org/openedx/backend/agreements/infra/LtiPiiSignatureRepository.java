package org.openedx.backend.agreements.infra;

import org.openedx.backend.agreements.domain.LtiPiiSignatureRecord;

import java.util.Optional;

public interface LtiPiiSignatureRepository {
    Optional<LtiPiiSignatureRecord> find(String username, String courseId);

    LtiPiiSignatureRecord save(LtiPiiSignatureRecord record);
}
