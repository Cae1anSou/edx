package org.openedx.backend.courseexperience.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.courseexperience.application.CourseExperienceService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/course_experience/v1")
public class CourseExperienceController {

    private final CourseExperienceService service;

    public CourseExperienceController(CourseExperienceService service) {
        this.service = service;
    }

    @PostMapping({"/reset_course_deadlines", "/reset_course_deadlines/"})
    public ResponseEntity<?> resetCourseDeadlines(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        String userId = currentUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        String courseKey = body == null ? null : toString(body.get("course_key"));
        if (!StringUtils.hasText(courseKey)) {
            return ResponseEntity.badRequest().body(Map.of("detail", "'course_key' is required."));
        }
        return ResponseEntity.ok(service.resetCourseDeadlines(userId, courseKey));
    }

    @PostMapping({"/reset_all_course_deadlines", "/reset_all_course_deadlines/"})
    public ResponseEntity<?> resetAllCourseDeadlines(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        String userId = currentUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(service.resetAllCourseDeadlines(userId));
    }

    @GetMapping({"/course_deadlines_info/{courseKey:.+}", "/course_deadlines_info/{courseKey:.+}/"})
    public ResponseEntity<?> courseDeadlinesInfo(HttpServletRequest request, @PathVariable String courseKey) {
        String userId = currentUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        if (!service.courseVisibleForUser(userId, courseKey)) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(service.mobileDeadlinesInfo(userId, courseKey));
    }

    private String currentUser(HttpServletRequest request) {
        String userId = request.getHeader("X-User-Id");
        return StringUtils.hasText(userId) ? userId : null;
    }

    private String toString(Object value) {
        return value instanceof String s ? s : null;
    }
}
