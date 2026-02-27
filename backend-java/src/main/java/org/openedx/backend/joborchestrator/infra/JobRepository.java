package org.openedx.backend.joborchestrator.infra;

import org.openedx.backend.joborchestrator.domain.JobRecord;

import java.util.List;
import java.util.Optional;

public interface JobRepository {

    Optional<JobRecord> findByJobId(String jobId);

    JobRecord save(JobRecord jobRecord);

    List<JobRecord> list(int page, int size);

    long count();

    List<JobRecord> findByStatus(String status, int limit);
}
