package org.openedx.backend.joborchestrator.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireRole;
import org.openedx.backend.joborchestrator.application.JobOrchestratorService;
import org.openedx.backend.joborchestrator.domain.JobRecord;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobOrchestratorController {

    private final JobOrchestratorService service;

    public JobOrchestratorController(JobOrchestratorService service) {
        this.service = service;
    }

    @PostMapping
    @RequirePermission("job:submit")
    @RequireRole("INSTRUCTOR")
    public ApiResponse<JobResponse> submit(@Valid @RequestBody SubmitJobRequest request) {
        return ApiResponse.success(toResponse(service.submit(request.jobType(), request.payload())));
    }

    @GetMapping("/{jobId}")
    @RequirePermission("job:read")
    public ApiResponse<JobResponse> get(@PathVariable String jobId) {
        return ApiResponse.success(toResponse(service.get(jobId)));
    }

    @PutMapping("/{jobId}/running")
    @RequirePermission("job:manage")
    public ApiResponse<JobResponse> markRunning(@PathVariable String jobId) {
        return ApiResponse.success(toResponse(service.markRunning(jobId)));
    }

    @PutMapping("/{jobId}/succeeded")
    @RequirePermission("job:manage")
    public ApiResponse<JobResponse> markSucceeded(@PathVariable String jobId) {
        return ApiResponse.success(toResponse(service.markSucceeded(jobId)));
    }

    @PutMapping("/{jobId}/failed")
    @RequirePermission("job:manage")
    public ApiResponse<JobResponse> markFailed(@PathVariable String jobId) {
        return ApiResponse.success(toResponse(service.markFailed(jobId)));
    }

    private JobResponse toResponse(JobRecord record) {
        return new JobResponse(
                record.jobId(),
                record.jobType(),
                record.payload(),
                record.status(),
                record.createdAt(),
                record.updatedAt()
        );
    }
}
