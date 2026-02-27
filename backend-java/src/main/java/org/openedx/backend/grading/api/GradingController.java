package org.openedx.backend.grading.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireRole;
import org.openedx.backend.grading.application.GradingService;
import org.openedx.backend.grading.domain.GradeRecord;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/grades/{userId}")
public class GradingController {

    private final GradingService service;

    public GradingController(GradingService service) {
        this.service = service;
    }

    @GetMapping
    @RequirePermission("grade:read")
    public ApiResponse<GradeResponse> get(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.get(userId, courseId)));
    }

    @PutMapping
    @RequirePermission("grade:write")
    @RequireRole("INSTRUCTOR")
    public ApiResponse<GradeResponse> update(
            @PathVariable String courseId,
            @PathVariable String userId,
            @Valid @RequestBody UpdateGradeRequest request
    ) {
        return ApiResponse.success(toResponse(service.upsert(userId, courseId, request.score())));
    }

    private GradeResponse toResponse(GradeRecord record) {
        return new GradeResponse(
                record.userId(),
                record.courseId(),
                record.score(),
                record.letterGrade(),
                record.updatedAt()
        );
    }
}
