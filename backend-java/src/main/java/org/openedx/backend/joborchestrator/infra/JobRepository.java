package org.openedx.backend.joborchestrator.infra;

import org.openedx.backend.joborchestrator.domain.JobRecord;

import java.util.Optional;

public interface JobRepository {

    Optional<JobRecord> findByJobId(String jobId);

    JobRecord save(JobRecord jobRecord);
}
