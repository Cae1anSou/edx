package org.openedx.backend.agreements.application;

import org.openedx.backend.agreements.domain.IntegritySignatureRecord;
import org.openedx.backend.agreements.domain.LtiPiiSignatureRecord;
import org.openedx.backend.agreements.infra.IntegritySignatureRepository;
import org.openedx.backend.agreements.infra.LtiPiiSignatureRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Service
public class AgreementsService {

    private final IntegritySignatureRepository integrityRepository;
    private final LtiPiiSignatureRepository ltiPiiRepository;

    public AgreementsService(
            IntegritySignatureRepository integrityRepository,
            LtiPiiSignatureRepository ltiPiiRepository
    ) {
        this.integrityRepository = integrityRepository;
        this.ltiPiiRepository = ltiPiiRepository;
    }

    public Optional<IntegritySignatureRecord> getIntegritySignature(String username, String courseId) {
        return integrityRepository.find(username, courseId);
    }

    public IntegritySignatureRecord createIntegritySignature(String username, String courseId) {
        return integrityRepository.find(username, courseId)
                .orElseGet(() -> integrityRepository.save(new IntegritySignatureRecord(username, courseId, Instant.now())));
    }

    public LtiPiiSignatureRecord upsertLtiPiiSignature(String username, String courseId, Map<String, Object> ltiTools) {
        Instant createdAt = ltiPiiRepository.find(username, courseId)
                .map(LtiPiiSignatureRecord::createdAt)
                .orElse(Instant.now());
        LtiPiiSignatureRecord next = new LtiPiiSignatureRecord(username, courseId, ltiTools, createdAt);
        return ltiPiiRepository.save(next);
    }
}
