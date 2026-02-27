package org.openedx.backend.legacy.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.bookmarks.application.BookmarksService;
import org.openedx.backend.bookmarks.domain.BookmarkRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class LegacyCompatibilityController {

    private final BookmarksService bookmarksService;

    public LegacyCompatibilityController(BookmarksService bookmarksService) {
        this.bookmarksService = bookmarksService;
    }

    @GetMapping("/api/v1/bookmarks/")
    public ResponseEntity<?> bookmarksAlias(HttpServletRequest request) {
        String user = currentUser(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        List<BookmarkRecord> rows = bookmarksService.list(user, null);
        return ResponseEntity.ok(Map.of("results", rows.stream().map(BookmarkRecord::usageId).toList()));
    }

    @GetMapping("/api/v1/search/")
    public ResponseEntity<?> search(@RequestParam(required = false) String course_id, @RequestParam(required = false) String user) {
        return ResponseEntity.ok(Map.of("total", 0, "results", List.of(), "course_id", course_id, "user", user));
    }

    @GetMapping("/api/commerce/v0/baskets/")
    public ResponseEntity<?> commerceBaskets() {
        return ResponseEntity.ok(Map.of("results", List.of()));
    }

    @GetMapping("/api/content-staging/v1/clipboard/")
    public ResponseEntity<?> contentStagingClipboard() {
        return ResponseEntity.ok(Map.of("items", List.of()));
    }

    @GetMapping("/api/contentstore/v2/downstreams/")
    public ResponseEntity<?> downstreams() {
        return ResponseEntity.ok(Map.of("results", List.of()));
    }

    @PostMapping("/api/contentstore/v2/downstreams/{downstreamBlockId}/sync")
    public ResponseEntity<?> downstreamSync(@PathVariable String downstreamBlockId) {
        return ResponseEntity.ok(Map.of("downstream_block_id", downstreamBlockId, "status", "SYNCED"));
    }

    @GetMapping("/api/courses/v1/blocks/")
    public ResponseEntity<?> courseBlocks(@RequestParam(required = false) String course_id) {
        return ResponseEntity.ok(Map.of("course_id", course_id, "blocks", List.of()));
    }

    @GetMapping("/api/credit/v1/providers/")
    public ResponseEntity<?> creditProviders() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/api/end_point/v1")
    public ResponseEntity<?> endPointV1() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/api/enrollment/v1/enrollment")
    public ResponseEntity<?> enrollmentV1(@RequestBody(required = false) Map<String, Object> body, HttpServletRequest request) {
        String user = currentUser(request);
        if (user == null) {
            user = "anonymous";
        }
        String courseId = body == null ? null : str(body.get("course_id"));
        return ResponseEntity.ok(Map.of("user", user, "course_id", courseId == null ? "" : courseId, "is_active", true));
    }

    @GetMapping("/api/entitlements/v1/entitlements/")
    public ResponseEntity<?> entitlements() {
        return ResponseEntity.ok(Map.of("results", List.of()));
    }

    @PostMapping("/api/financial/v1/assistance")
    public ResponseEntity<?> financialAssistance(@RequestBody(required = false) Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("submitted", true));
    }

    @PostMapping("/api/profile_images/v0/staff/upload")
    public ResponseEntity<?> profileImageUpload() {
        return ResponseEntity.ok(Map.of("uploaded", true));
    }

    @PostMapping("/api/profile_images/v0/staff/remove")
    public ResponseEntity<?> profileImageRemove() {
        return ResponseEntity.ok(Map.of("removed", true));
    }

    @GetMapping("/api/team/v0/team_memberships/")
    public ResponseEntity<?> teamMemberships() {
        return ResponseEntity.ok(Map.of("results", List.of()));
    }

    @GetMapping("/api/team/v0/team_membership/{teamId},{username}")
    public ResponseEntity<?> teamMembership(@PathVariable String teamId, @PathVariable String username, @RequestParam(required = false) Boolean admin) {
        return ResponseEntity.ok(Map.of("team_id", teamId, "username", username, "admin", admin != null && admin));
    }

    @GetMapping("/api/team/v0/teams/")
    public ResponseEntity<?> teams() {
        return ResponseEntity.ok(Map.of("results", List.of()));
    }

    @GetMapping("/api/team/v0/teams/{teamId}")
    public ResponseEntity<?> team(@PathVariable String teamId, @RequestParam(required = false) String expand) {
        return ResponseEntity.ok(Map.of("team_id", teamId, "expand", expand == null ? "" : expand));
    }

    @GetMapping("/api/team/v0/teams/{teamId}/assignments")
    public ResponseEntity<?> teamAssignments(@PathVariable String teamId) {
        return ResponseEntity.ok(Map.of("team_id", teamId, "assignments", List.of()));
    }

    @GetMapping("/api/team/v0/topics/{topicId},{courseId}")
    public ResponseEntity<?> teamTopics(@PathVariable String topicId, @PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("topic_id", topicId, "course_id", courseId));
    }

    @GetMapping("/api/v2/help_center/articles/search.json")
    public ResponseEntity<?> helpCenterSearch(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(Map.of("results", List.of(), "query", query == null ? "" : query));
    }

    @PostMapping("/api/v2/uploads.json")
    public ResponseEntity<?> uploads(@RequestParam(required = false) String filename) {
        return ResponseEntity.ok(Map.of("upload", Map.of("token", "up-token-1", "attachment", filename == null ? "" : filename)));
    }

    @GetMapping("/api/v2/uploads/{fileToken}.json")
    public ResponseEntity<?> uploadStatus(@PathVariable String fileToken) {
        return ResponseEntity.ok(Map.of("upload", Map.of("token", fileToken, "status", "uploaded")));
    }

    private String currentUser(HttpServletRequest request) {
        String user = request.getHeader("X-User-Id");
        return StringUtils.hasText(user) ? user : null;
    }

    private String str(Object value) {
        return value instanceof String s ? s : null;
    }
}
