package org.openedx.backend.studio.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.nio.file.Path;
import java.time.Duration;

@Controller
public class StudioDashboardFrontendController {

    private final String distDir;

    public StudioDashboardFrontendController(
            @Value("${app.studio-dashboard.dist-dir:../frontend-app-studio-dashboard/dist}") String distDir
    ) {
        this.distDir = distDir;
    }

    @GetMapping({
            "/",
            "/course",
            "/course/",
            "/course/{courseKey:.+}",
            "/rerun",
            "/rerun/",
            "/rerun/{sourceCourseKey:.+}",
            "/course_rerun",
            "/course_rerun/",
            "/course_rerun/{sourceCourseKey:.+}",
            "/team",
            "/tasks",
            "/notifications",
            "/notification-preferences",
            "/help-center",
            "/user-tours",
            "/mfe-branding",
            "/legacy-compatibility",
            "/api-families",
            "/teams-v0",
            "/uploads",
            "/contentstore",
            "/learner-services",
            "/instructor-tools",
            "/legacy-system-apis",
            "/course-operations",
            "/learner-experience",
            "/platform-integrations",
            "/search-commerce",
            "/authoring-apis",
            "/identity-access",
            "/compliance",
            "/system-status",
            "/notifications-center",
            "/resource-builder"
    })
    public ResponseEntity<Resource> spaIndex() {
        Resource index = resolveResource("index.html");
        if (!index.exists()) {
            return ResponseEntity.status(503).contentType(MediaType.TEXT_PLAIN)
                    .body(new ClassPathResource("static/studio-dashboard-unavailable.txt"));
        }
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .cacheControl(CacheControl.noStore())
                .body(index);
    }

    @GetMapping("/assets/**")
    public ResponseEntity<Resource> assets(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String assetPath = requestUri.length() > "/assets/".length()
                ? requestUri.substring("/assets/".length())
                : "";
        if (assetPath.isBlank() || assetPath.contains("..")) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = resolveResource("assets/" + assetPath);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        MediaType mediaType = MediaTypeFactory.getMediaType(assetPath).orElse(MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .cacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic().immutable())
                .body(resource);
    }

    private Resource resolveResource(String relativePath) {
        Path normalizedPath = Path.of(relativePath).normalize();
        if (normalizedPath.startsWith("..")) {
            return new ClassPathResource("static/never-exists");
        }
        Path filePath = Path.of(distDir).resolve(normalizedPath).normalize();
        Resource fileResource = new FileSystemResource(filePath);
        if (fileResource.exists()) {
            return fileResource;
        }
        return new ClassPathResource("static/" + normalizedPath);
    }
}
