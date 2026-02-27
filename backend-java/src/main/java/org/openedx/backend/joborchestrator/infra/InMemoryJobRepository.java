package org.openedx.backend.joborchestrator.infra;

import org.openedx.backend.joborchestrator.domain.JobRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
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

    @Override
    public List<JobRecord> list(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(JobRecord::createdAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    @Override
    public long count() {
        return store.size();
    }

    @Override
    public List<JobRecord> findByStatus(String status, int limit) {
        return store.values().stream()
                .filter(job -> status.equals(job.status()))
                .sorted(Comparator.comparing(JobRecord::createdAt))
                .limit(limit)
                .toList();
    }
}
