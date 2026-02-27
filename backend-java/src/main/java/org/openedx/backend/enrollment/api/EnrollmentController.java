package org.openedx.backend.enrollment.api;

import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireResearchGroup;
import org.openedx.backend.enrollment.application.EnrollmentService;
import org.openedx.backend.enrollment.domain.EnrollmentRecord;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/enrollments/{userId}")
public class EnrollmentController {

    private final EnrollmentService service;

    public EnrollmentController(EnrollmentService service) {
        this.service = service;
    }

    @PutMapping
    @RequirePermission("enrollment:write")
    @RequireResearchGroup("teaching")
    public ApiResponse<EnrollmentResponse> enroll(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.enroll(userId, courseId)));
    }

    @GetMapping
    @RequirePermission("enrollment:read")
    public ApiResponse<EnrollmentResponse> get(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.get(userId, courseId)));
    }

    @DeleteMapping
    @RequirePermission("enrollment:write")
    @RequireResearchGroup("teaching")
    public ApiResponse<EnrollmentResponse> unenroll(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.unenroll(userId, courseId)));
    }

    private EnrollmentResponse toResponse(EnrollmentRecord record) {
        return new EnrollmentResponse(
                record.userId(),
                record.courseId(),
                record.status(),
                record.enrolledAt(),
                record.updatedAt()
        );
    }
}
