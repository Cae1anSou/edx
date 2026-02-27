package org.openedx.backend.coursex.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.coursex.application.CourseXService;
import org.openedx.backend.coursex.domain.CourseXRecord;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/coursexs")
public class CourseXController {

    private final CourseXService service;

    public CourseXController(CourseXService service) {
        this.service = service;
    }

    @PostMapping
    @RequirePermission("coursex:create")
    public ApiResponse<CourseXResponse> create(@Valid @RequestBody CreateCourseXRequest request) {
        return ApiResponse.success(toResponse(
                service.create(request.parentCourseId(), request.displayName(), request.ownerUserId())
        ));
    }

    @GetMapping("/{courseXId}")
    @RequirePermission("coursex:read")
    public ApiResponse<CourseXResponse> get(@PathVariable String courseXId) {
        return ApiResponse.success(toResponse(service.get(courseXId)));
    }

    @GetMapping
    @RequirePermission("coursex:list")
    public ApiResponse<PageResponse<CourseXResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<CourseXRecord> records = service.list(page, size);
        PageResponse<CourseXResponse> mapped = new PageResponse<>(
                records.items().stream().map(this::toResponse).toList(),
                records.page(),
                records.size(),
                records.total()
        );
        return ApiResponse.success(mapped);
    }

    private CourseXResponse toResponse(CourseXRecord record) {
        return new CourseXResponse(
                record.courseXId(),
                record.parentCourseId(),
                record.displayName(),
                record.ownerUserId(),
                record.createdAt(),
                record.updatedAt()
        );
    }
}
