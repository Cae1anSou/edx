package org.openedx.backend.joborchestrator.infra;

import org.openedx.backend.joborchestrator.domain.JobRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
@ConditionalOnProperty(name = "app.job-orchestrator.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryJobRepository implements JobRepository {

    private final ConcurrentMap<String, JobRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<JobRecord> findByJobId(String jobId) {
        return Optional.ofNullable(store.get(jobId));
    }

    @Override
    public JobRecord save(JobRecord jobRecord) {
        store.put(jobRecord.jobId(), jobRecord);
        return jobRecord;
    }
}
