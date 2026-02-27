package org.openedx.backend.joborchestrator.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.job-orchestrator.scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class JobExecutorScheduler {

    private static final Logger log = LoggerFactory.getLogger(JobExecutorScheduler.class);

    private final JobOrchestratorService jobOrchestratorService;

    public JobExecutorScheduler(JobOrchestratorService jobOrchestratorService) {
        this.jobOrchestratorService = jobOrchestratorService;
    }

    @Scheduled(fixedDelayString = "${app.job-orchestrator.scheduler.fixed-delay-ms:5000}")
    public void executePendingJobs() {
        int handled = jobOrchestratorService.executePendingBatch(20);
        if (handled > 0) {
            log.info("job_orchestrator_scheduler handled={}", handled);
        }
    }
}
