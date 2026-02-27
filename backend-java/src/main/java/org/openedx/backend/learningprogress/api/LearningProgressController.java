package org.openedx.backend.learningprogress.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireRole;
import org.openedx.backend.learningprogress.application.LearningProgressService;
import org.openedx.backend.learningprogress.domain.LearningProgress;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/courses/{courseId}/progress/{userId}")
public class LearningProgressController {

    private final LearningProgressService service;

    public LearningProgressController(LearningProgressService service) {
        this.service = service;
    }

    @GetMapping
    @RequirePermission("progress:read")
    public ApiResponse<LearningProgressResponse> get(@PathVariable String courseId, @PathVariable String userId) {
        return ApiResponse.success(toResponse(service.get(userId, courseId)));
    }

    @PutMapping
    @RequirePermission("progress:write")
    @RequireRole("INSTRUCTOR")
    public ApiResponse<LearningProgressResponse> update(
            @PathVariable String courseId,
            @PathVariable String userId,
            @Valid @RequestBody UpdateLearningProgressRequest request
    ) {
        return ApiResponse.success(toResponse(service.update(userId, courseId, request.progressPercent())));
    }

    private LearningProgressResponse toResponse(LearningProgress p) {
        return new LearningProgressResponse(
                p.userId(),
                p.courseId(),
                p.progressPercent(),
                p.completed(),
                p.updatedAt()
        );
    }
}
