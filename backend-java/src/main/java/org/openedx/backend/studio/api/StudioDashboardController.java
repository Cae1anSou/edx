package org.openedx.backend.studio.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.studio.application.StudioDashboardService;
import org.openedx.backend.studio.application.StudioDashboardService.CreatedResource;
import org.openedx.backend.studio.application.StudioDashboardService.StudioDashboardPayload;
import org.openedx.backend.studio.application.StudioDashboardService.StudioPermissions;
import org.openedx.backend.studio.domain.StudioCourseItem;
import org.openedx.backend.studio.domain.StudioLibraryItem;
import org.openedx.backend.studio.domain.StudioNotificationItem;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/studio/v1")
public class StudioDashboardController {

    private final StudioDashboardService service;

    public StudioDashboardController(StudioDashboardService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public ApiResponse<StudioDashboardResponse> dashboard() {
        StudioDashboardPayload payload = service.dashboard();
        return ApiResponse.success(
                new StudioDashboardResponse(
                        payload.courses().stream().map(this::toCourseResponse).toList(),
                        payload.archivedCourses().stream().map(this::toCourseResponse).toList(),
                        payload.libraries().stream().map(this::toLibraryResponse).toList(),
                        payload.notifications().stream().map(this::toNotificationResponse).toList(),
                        toPermissionResponse(payload.permissions())
                )
        );
    }

    @GetMapping("/organizations")
    public ApiResponse<List<String>> organizations() {
        return ApiResponse.success(service.organizations());
    }

    @PostMapping("/courses")
    public ApiResponse<CreateStudioResourceResponse> createCourse(@Valid @RequestBody CreateStudioCourseRequest request) {
        CreatedResource created = service.createCourse(
                request.displayName(),
                request.org(),
                request.number(),
                request.run(),
                request.sourceCourseKey()
        );
        return ApiResponse.success(new CreateStudioResourceResponse(created.id(), created.url()));
    }

    @PostMapping("/courses/rerun")
    public ApiResponse<CreateStudioResourceResponse> rerunCourse(@Valid @RequestBody CreateStudioCourseRequest request) {
        CreatedResource created = service.rerunCourse(
                request.sourceCourseKey(),
                request.displayName(),
                request.org(),
                request.number(),
                request.run()
        );
        return ApiResponse.success(new CreateStudioResourceResponse(created.id(), created.url()));
    }

    @PostMapping("/libraries")
    public ApiResponse<CreateStudioResourceResponse> createLibrary(@Valid @RequestBody CreateStudioLibraryRequest request) {
        CreatedResource created = service.createLibrary(request.displayName(), request.org(), request.number());
        return ApiResponse.success(new CreateStudioResourceResponse(created.id(), created.url()));
    }

    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<Void> dismissNotification(@PathVariable String notificationId) {
        service.dismissNotification(notificationId);
        return ResponseEntity.noContent().build();
    }

    private StudioCourseItemResponse toCourseResponse(StudioCourseItem item) {
        return new StudioCourseItemResponse(
                item.id(),
                item.courseKey(),
                item.displayName(),
                item.org(),
                item.number(),
                item.run(),
                item.canEdit(),
                item.url(),
                item.lmsLink(),
                item.rerunLink()
        );
    }

    private StudioLibraryItemResponse toLibraryResponse(StudioLibraryItem item) {
        return new StudioLibraryItemResponse(
                item.id(),
                item.courseKey(),
                item.displayName(),
                item.org(),
                item.number(),
                item.canEdit(),
                item.url()
        );
    }

    private StudioPermissionsResponse toPermissionResponse(StudioPermissions permissions) {
        return new StudioPermissionsResponse(
                permissions.canCreateCourse(),
                permissions.canCreateLibrary(),
                permissions.allowReruns()
        );
    }

    private StudioNotificationItemResponse toNotificationResponse(StudioNotificationItem item) {
        return new StudioNotificationItemResponse(item.id(), item.title(), item.message());
    }
}
