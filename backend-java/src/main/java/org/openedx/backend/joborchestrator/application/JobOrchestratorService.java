package org.openedx.backend.joborchestrator.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.joborchestrator.domain.JobRecord;
import org.openedx.backend.joborchestrator.infra.JobRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class JobOrchestratorService {

    private final JobRepository repository;
    private final DomainEventPublisher eventPublisher;

    public JobOrchestratorService(JobRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public JobRecord submit(String jobType, String payload) {
        Instant now = Instant.now();
        JobRecord record = new JobRecord(
                "job-" + UUID.randomUUID(),
                jobType,
                payload,
                "PENDING",
                now,
                now
        );
        repository.save(record);
        eventPublisher.publish("JobSubmitted jobId=" + record.jobId() + " type=" + jobType);
        return record;
    }

    public JobRecord get(String jobId) {
        return repository.findByJobId(jobId)
                .orElseThrow(() -> new DomainNotFoundException("Job not found"));
    }

    public JobRecord markRunning(String jobId) {
        return transition(jobId, "RUNNING");
    }

    public JobRecord markSucceeded(String jobId) {
        return transition(jobId, "SUCCEEDED");
    }

    public JobRecord markFailed(String jobId) {
        return transition(jobId, "FAILED");
    }

    private JobRecord transition(String jobId, String status) {
        JobRecord current = get(jobId);
        JobRecord updated = new JobRecord(
                current.jobId(),
                current.jobType(),
                current.payload(),
                status,
                current.createdAt(),
                Instant.now()
        );
        repository.save(updated);
        eventPublisher.publish("JobStatusChanged jobId=" + jobId + " status=" + status);
        return updated;
    }
}
