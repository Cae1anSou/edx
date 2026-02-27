package org.openedx.backend.course.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.common.security.annotation.RequireRole;
import org.openedx.backend.course.application.CourseMetadataService;
import org.openedx.backend.course.domain.CourseMetadata;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/courses")
public class CourseMetadataController {

    private final CourseMetadataService service;

    public CourseMetadataController(CourseMetadataService service) {
        this.service = service;
    }

    @GetMapping("/{courseId}")
    @RequirePermission("course:read")
    public ApiResponse<CourseMetadataResponse> get(@PathVariable String courseId) {
        return ApiResponse.success(toResponse(service.get(courseId)));
    }

    @PutMapping("/{courseId}")
    @RequirePermission("course:write")
    @RequireRole("INSTRUCTOR")
    public ApiResponse<CourseMetadataResponse> upsert(
            @PathVariable String courseId,
            @Valid @RequestBody UpsertCourseRequest request
    ) {
        return ApiResponse.success(toResponse(
                service.upsert(courseId, request.title(), request.status(), request.ownerUserId())
        ));
    }

    @GetMapping("/list")
    @RequirePermission("course:list")
    public ApiResponse<PageResponse<CourseMetadataResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<CourseMetadata> courses = service.list(page, size);
        PageResponse<CourseMetadataResponse> mapped = new PageResponse<>(
                courses.items().stream().map(this::toResponse).toList(),
                courses.page(),
                courses.size(),
                courses.total()
        );
        return ApiResponse.success(mapped);
    }

    private CourseMetadataResponse toResponse(CourseMetadata metadata) {
        return new CourseMetadataResponse(
                metadata.courseId(),
                metadata.title(),
                metadata.status(),
                metadata.ownerUserId(),
                metadata.updatedAt()
        );
    }
}
