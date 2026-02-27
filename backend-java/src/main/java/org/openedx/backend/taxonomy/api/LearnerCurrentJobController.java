package org.openedx.backend.taxonomy.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.taxonomy.application.LearnerCurrentJobService;
import org.openedx.backend.taxonomy.domain.LearnerCurrentJobRecord;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/taxonomy/api/v1/learners-current-job")
public class LearnerCurrentJobController {

    private final LearnerCurrentJobService service;

    public LearnerCurrentJobController(LearnerCurrentJobService service) {
        this.service = service;
    }

    @GetMapping({"", "/"})
    @RequirePermission("taxonomy:learner-job:read")
    public ApiResponse<?> getOrList(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "1000", name = "page_size") int pageSize
    ) {
        if (username != null && !username.isBlank()) {
            return ApiResponse.success(toResponse(service.get(username)));
        }
        PageResponse<LearnerCurrentJobRecord> rows = service.list(0, pageSize);
        PageResponse<LearnerCurrentJobResponse> mapped = new PageResponse<>(
                rows.items().stream().map(this::toResponse).toList(),
                rows.page(),
                rows.size(),
                rows.total()
        );
        return ApiResponse.success(mapped);
    }

    @PostMapping({"", "/"})
    @RequirePermission("taxonomy:learner-job:write")
    public ApiResponse<LearnerCurrentJobResponse> upsert(@Valid @RequestBody UpsertLearnerCurrentJobRequest request) {
        return ApiResponse.success(toResponse(
                service.upsert(request.username(), request.company(), request.jobTitle())
        ));
    }

    private LearnerCurrentJobResponse toResponse(LearnerCurrentJobRecord record) {
        return new LearnerCurrentJobResponse(
                record.username(),
                record.company(),
                record.jobTitle(),
                record.updatedAt()
        );
    }
}
