package org.openedx.backend.certificate.api;

import org.openedx.backend.certificate.application.CertificateService;
import org.openedx.backend.certificate.domain.CertificateRecord;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireRole;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/certificates/{userId}")
public class CertificateController {

    private final CertificateService service;

    public CertificateController(CertificateService service) {
        this.service = service;
    }

    @GetMapping
    @RequirePermission("certificate:read")
    public ApiResponse<CertificateResponse> get(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.get(userId, courseId)));
    }

    @PostMapping
    @RequirePermission("certificate:write")
    @RequireRole("INSTRUCTOR")
    public ApiResponse<CertificateResponse> issue(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.issue(userId, courseId)));
    }

    @DeleteMapping
    @RequirePermission("certificate:write")
    @RequireRole("INSTRUCTOR")
    public ApiResponse<CertificateResponse> revoke(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.revoke(userId, courseId)));
    }

    private CertificateResponse toResponse(CertificateRecord record) {
        return new CertificateResponse(
                record.userId(),
                record.courseId(),
                record.status(),
                record.certificateUrl(),
                record.issuedAt(),
                record.updatedAt()
        );
    }
}
