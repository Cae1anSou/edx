package org.openedx.backend.certificate.infra;

import org.openedx.backend.certificate.domain.CertificateRecord;

import java.util.Optional;

public interface CertificateRepository {

    Optional<CertificateRecord> find(String userId, String courseId);

    CertificateRecord save(CertificateRecord certificateRecord);
}
