package org.openedx.backend.certificate.application;

import org.openedx.backend.certificate.domain.CertificateRecord;
import org.openedx.backend.certificate.infra.CertificateRepository;
import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class CertificateService {

    private final CertificateRepository repository;
    private final DomainEventPublisher eventPublisher;

    public CertificateService(CertificateRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public CertificateRecord get(String userId, String courseId) {
        return repository.find(userId, courseId)
                .orElseThrow(() -> new DomainNotFoundException("Certificate not found"));
    }

    public CertificateRecord issue(String userId, String courseId) {
        Instant now = Instant.now();
        CertificateRecord record = new CertificateRecord(
                userId,
                courseId,
                "ISSUED",
                buildCertificateUrl(userId, courseId),
                now,
                now
        );
        repository.save(record);
        eventPublisher.publish("CertificateIssued userId=" + userId + " courseId=" + courseId);
        return record;
    }

    public CertificateRecord revoke(String userId, String courseId) {
        CertificateRecord current = repository.find(userId, courseId)
                .orElseThrow(() -> new DomainNotFoundException("Certificate not found"));
        CertificateRecord record = new CertificateRecord(
                userId,
                courseId,
                "REVOKED",
                current.certificateUrl(),
                current.issuedAt(),
                Instant.now()
        );
        repository.save(record);
        eventPublisher.publish("CertificateRevoked userId=" + userId + " courseId=" + courseId);
        return record;
    }

    private String buildCertificateUrl(String userId, String courseId) {
        return "https://cert.example.local/" + courseId + "/" + userId;
    }
}
