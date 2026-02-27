package org.openedx.backend.enterprise.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.enterprise.application.EnterpriseLearnerService;
import org.openedx.backend.enterprise.domain.EnterpriseLearnerRecord;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/enterprise/api/v1/enterprise-learner")
public class EnterpriseLearnerController {

    private final EnterpriseLearnerService service;

    public EnterpriseLearnerController(EnterpriseLearnerService service) {
        this.service = service;
    }

    @GetMapping
    @RequirePermission("enterprise:learner:read")
    public ApiResponse<?> getOrList(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        if (username != null && !username.isBlank()) {
            return ApiResponse.success(toResponse(service.getByUsername(username)));
        }
        PageResponse<EnterpriseLearnerRecord> rows = service.list(page, size);
        PageResponse<EnterpriseLearnerResponse> mapped = new PageResponse<>(
                rows.items().stream().map(this::toResponse).toList(),
                rows.page(),
                rows.size(),
                rows.total()
        );
        return ApiResponse.success(mapped);
    }

    @PostMapping
    @RequirePermission("enterprise:learner:write")
    public ApiResponse<EnterpriseLearnerResponse> upsert(@Valid @RequestBody UpsertEnterpriseLearnerRequest request) {
        return ApiResponse.success(toResponse(
                service.upsert(request.username(), request.enterpriseId(), request.active())
        ));
    }

    private EnterpriseLearnerResponse toResponse(EnterpriseLearnerRecord record) {
        return new EnterpriseLearnerResponse(
                record.username(),
                record.enterpriseId(),
                record.active(),
                record.updatedAt()
        );
    }
}
