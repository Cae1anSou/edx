package org.openedx.backend.consent.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.consent.application.DataSharingConsentService;
import org.openedx.backend.consent.domain.DataSharingConsentRecord;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/consent/api/v1/data_sharing_consent")
public class DataSharingConsentController {

    private final DataSharingConsentService service;

    public DataSharingConsentController(DataSharingConsentService service) {
        this.service = service;
    }

    @GetMapping
    @RequirePermission("consent:read")
    public ApiResponse<DataSharingConsentResponse> get(@RequestParam String username) {
        return ApiResponse.success(toResponse(service.get(username)));
    }

    @PostMapping
    @RequirePermission("consent:write")
    public ApiResponse<DataSharingConsentResponse> upsert(@Valid @RequestBody UpsertDataSharingConsentRequest request) {
        return ApiResponse.success(toResponse(service.upsert(request.username(), request.consented())));
    }

    private DataSharingConsentResponse toResponse(DataSharingConsentRecord record) {
        return new DataSharingConsentResponse(
                record.username(),
                record.consented(),
                record.updatedAt()
        );
    }
}
