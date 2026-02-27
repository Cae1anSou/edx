package org.openedx.backend.legacy.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.legacy.application.LegacyUserToursService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class LegacyMfeBrandingUserToursController {

    private final LegacyUserToursService userToursService;

    public LegacyMfeBrandingUserToursController(LegacyUserToursService userToursService) {
        this.userToursService = userToursService;
    }

    @GetMapping("/api/mfe_config/v1")
    public ResponseEntity<?> mfeConfig(@RequestParam(required = false) String mfe) {
        LinkedHashMap<String, Object> config = new LinkedHashMap<>();
        config.put("LMS_BASE_URL", "http://localhost:18000");
        config.put("STUDIO_BASE_URL", "http://localhost:18010");
        config.put("LANGUAGE_PREFERENCE_COOKIE_NAME", "openedx-language-preference");
        config.put("ENABLE_COURSE_SORTING_BY_START_DATE", true);
        if ("learning".equals(mfe)) {
            config.put("BASE_URL", "http://localhost:2000/learning");
        } else if (StringUtils.hasText(mfe)) {
            config.put("BASE_URL", "http://localhost:2000/" + mfe);
        }
        return ResponseEntity.ok(config);
    }

    @GetMapping("/api/branding/v1/footer")
    public ResponseEntity<?> brandingFooter(HttpServletRequest request) {
        String accepts = request.getHeader("Accept");
        if (accepts != null && accepts.contains("application/json")) {
            return ResponseEntity.ok(Map.of(
                    "navigation_links", List.of(Map.of("url", "/about", "name", "about", "title", "About")),
                    "legal_links", List.of(Map.of("url", "/tos", "name", "terms_of_service", "title", "Terms of Service")),
                    "logo_image", "/static/logo.png"
            ));
        }
        String html = "<footer><a href=\"/about\">About</a><span>Powered by Open edX</span></footer>";
        return ResponseEntity.ok().contentType(MediaType.TEXT_HTML).body(html);
    }

    @GetMapping("/api/user_tours/v1/{username}")
    public ResponseEntity<?> userTour(HttpServletRequest request, @PathVariable String username) {
        String current = currentUser(request);
        if (current == null) {
            return ResponseEntity.status(401).build();
        }
        if (!current.equals(username) && !isStaff(request)) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(userToursService.getUserTour(username));
    }

    @PatchMapping("/api/user_tours/v1/{username}")
    public ResponseEntity<?> patchUserTour(HttpServletRequest request, @PathVariable String username, @RequestBody(required = false) Map<String, Object> body) {
        String current = currentUser(request);
        if (current == null) {
            return ResponseEntity.status(401).build();
        }
        if (!current.equals(username)) {
            return ResponseEntity.badRequest().build();
        }
        userToursService.patchUserTour(username, body == null ? Map.of() : body);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/user_tours/v1/discussions/")
    public ResponseEntity<?> discussionTours(HttpServletRequest request) {
        String current = currentUser(request);
        if (current == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(userToursService.listDiscussionTours(current));
    }

    @PutMapping("/api/user_tours/v1/discussions/{tourId}")
    public ResponseEntity<?> updateDiscussionTour(
            HttpServletRequest request,
            @PathVariable int tourId,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        String current = currentUser(request);
        if (current == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(userToursService.updateDiscussionTour(current, tourId, body == null ? Map.of() : body));
        } catch (LegacyUserToursService.NotFoundException ex) {
            return ResponseEntity.status(404).build();
        }
    }

    private String currentUser(HttpServletRequest request) {
        String user = request.getHeader("X-User-Id");
        return StringUtils.hasText(user) ? user : null;
    }

    private boolean isStaff(HttpServletRequest request) {
        String roles = request.getHeader("X-Roles");
        return StringUtils.hasText(roles) && roles.contains("STAFF");
    }
}
