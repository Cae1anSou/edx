package org.openedx.backend.studio.api;

import jakarta.validation.Valid;
import org.openedx.backend.studio.application.StudioDashboardService;
import org.openedx.backend.studio.application.StudioDashboardService.CreatedResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class StudioLegacyCompatibilityController {

    private final StudioDashboardService service;

    public StudioLegacyCompatibilityController(StudioDashboardService service) {
        this.service = service;
    }

    @PostMapping("/course/")
    public Map<String, String> createCourse(@Valid @RequestBody CreateStudioCourseRequest request) {
        CreatedResource created = service.createCourse(
                request.displayName(),
                request.org(),
                request.number(),
                request.run(),
                request.sourceCourseKey()
        );
        return Map.of("url", created.url());
    }

    @PostMapping("/library/")
    public Map<String, String> createLibrary(@Valid @RequestBody CreateStudioLibraryRequest request) {
        CreatedResource created = service.createLibrary(request.displayName(), request.org(), request.number());
        return Map.of("url", created.url());
    }
}
