package org.openedx.backend.legacy.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.legacy.application.LegacyInstructorService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class LegacyAdditionalApiFamiliesController {

    private final LegacyInstructorService instructorService;

    public LegacyAdditionalApiFamiliesController(LegacyInstructorService instructorService) {
        this.instructorService = instructorService;
    }

    @PostMapping("/api/bulk_enroll/v1/bulk_enroll")
    public ResponseEntity<?> bulkEnroll(@RequestBody(required = false) Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("status", "accepted", "submitted", body != null));
    }

    @GetMapping("/api/ccx/v0/")
    public ResponseEntity<?> ccx() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/certificates/v0/")
    public ResponseEntity<?> certificates() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/change_email_settings/")
    public ResponseEntity<?> changeEmailSettings(HttpServletRequest request) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of("email_opt_in", true));
    }

    @GetMapping("/api/cohorts/v1/")
    public ResponseEntity<?> cohorts() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/content_search/v2/studio/")
    public ResponseEntity<?> contentSearch() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/content_tagging/v1/")
    public ResponseEntity<?> contentTagging() { return ResponseEntity.ok(Map.of("tags", List.of())); }

    @GetMapping("/api/course_home/")
    public ResponseEntity<?> courseHome() { return ResponseEntity.ok(Map.of("status", "ok")); }

    @GetMapping("/api/course_home/v1/")
    public ResponseEntity<?> courseHomeV1() { return ResponseEntity.ok(Map.of("status", "ok", "version", "v1")); }

    @GetMapping("/api/course_modes/v1/")
    public ResponseEntity<?> courseModes() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/courses/{courseId}/bulk_enable_disable_discussions")
    public ResponseEntity<?> bulkEnableDisableDiscussions(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("course_id", courseId, "status", "ok"));
    }

    @GetMapping("/api/dashboard/")
    public ResponseEntity<?> dashboard(HttpServletRequest request) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of("courses", List.of()));
    }

    @GetMapping("/api/discounts/v1/")
    public ResponseEntity<?> discounts() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/discussion/v1/")
    public ResponseEntity<?> discussion() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/edxnotes/v1/")
    public ResponseEntity<?> edxnotes() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/embargo/v1/")
    public ResponseEntity<?> embargo() { return ResponseEntity.ok(Map.of("enabled", false)); }

    @GetMapping("/api/experiments/v1/")
    public ResponseEntity<?> experiments() { return ResponseEntity.ok(Map.of("experiments", List.of())); }

    @GetMapping("/api/instructor/v1/")
    public ResponseEntity<?> instructorV1(HttpServletRequest request, @RequestParam(name = "course_id", required = false) String courseId) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        if (!StringUtils.hasText(courseId)) return ResponseEntity.badRequest().body(Map.of("detail", "course_id is required"));
        return ResponseEntity.ok(instructorService.v1Summary(courseId));
    }

    @GetMapping("/api/instructor/v2/")
    public ResponseEntity<?> instructorV2(HttpServletRequest request) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of("results", List.of()));
    }

    @GetMapping("/api/instructor/v2/courses/{courseId}")
    public ResponseEntity<?> instructorV2Course(HttpServletRequest request, @PathVariable String courseId) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(instructorService.v2CourseInfo(courseId));
    }

    @GetMapping("/api/instructor/v2/courses/{courseId}/instructor_tasks")
    public ResponseEntity<?> instructorV2CourseTasks(
            HttpServletRequest request,
            @PathVariable String courseId,
            @RequestParam(name = "problem_location_str", required = false) String problemLocation
    ) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(instructorService.v2InstructorTasks(courseId, problemLocation));
    }

    @GetMapping("/api/instructor_task/v1/")
    public ResponseEntity<?> instructorTask() { return ResponseEntity.ok(Map.of("tasks", List.of())); }

    @GetMapping("/api/learner_home/")
    public ResponseEntity<?> learnerHome(HttpServletRequest request) {
        if (!hasUser(request)) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(Map.of("highlights", List.of()));
    }

    @GetMapping("/api/learning_sequences/v1/")
    public ResponseEntity<?> learningSequences() { return ResponseEntity.ok(Map.of("sequences", List.of())); }

    @GetMapping("/api/libraries/v2/")
    public ResponseEntity<?> libraries() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/mobile/{apiVersion}")
    public ResponseEntity<?> mobile(@PathVariable String apiVersion) {
        return ResponseEntity.ok(Map.of("api_version", apiVersion));
    }

    @GetMapping("/api/modulestore_migrator/v1/")
    public ResponseEntity<?> modulestoreMigrator() { return ResponseEntity.ok(Map.of("status", "idle")); }

    @GetMapping("/api/olx-export/v1/")
    public ResponseEntity<?> olxExport() { return ResponseEntity.ok(Map.of("exports", List.of())); }

    @GetMapping("/api/ora_staff_grader/v1/")
    public ResponseEntity<?> oraStaffGrader() { return ResponseEntity.ok(Map.of("submissions", List.of())); }

    @GetMapping("/api/organizations/v0/")
    public ResponseEntity<?> organizations() { return ResponseEntity.ok(Map.of("results", List.of())); }

    @GetMapping("/api/third_party_auth/v0/providers/")
    public ResponseEntity<?> thirdPartyAuthProviders() { return ResponseEntity.ok(Map.of("providers", List.of())); }

    @GetMapping("/api/val/v0/")
    public ResponseEntity<?> val() { return ResponseEntity.ok(Map.of("entitlements", List.of())); }

    @GetMapping("/api/xblock/v2/")
    public ResponseEntity<?> xblockV2() { return ResponseEntity.ok(Map.of("blocks", List.of())); }

    @GetMapping("/api/youtube/courses/{courseId}/edx-video-ids")
    public ResponseEntity<?> youtubeVideoIds(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("course_id", courseId, "video_ids", List.of()));
    }

    private boolean hasUser(HttpServletRequest request) {
        String user = request.getHeader("X-User-Id");
        return StringUtils.hasText(user);
    }
}
