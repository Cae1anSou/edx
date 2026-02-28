package org.openedx.backend.legacy.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.bookmarks.application.BookmarksService;
import org.openedx.backend.bookmarks.domain.BookmarkRecord;
import org.openedx.backend.common.security.annotation.RequireLogin;
import org.openedx.backend.legacy.application.LegacyContentstoreService;
import org.openedx.backend.legacy.application.LegacyHelpCenterService;
import org.openedx.backend.legacy.application.LegacyTeamService;
import org.openedx.backend.legacy.application.LegacyUploadService;
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
public class LegacyCompatibilityController {

    private final BookmarksService bookmarksService;
    private final LegacyContentstoreService contentstoreService;
    private final LegacyTeamService teamService;
    private final LegacyHelpCenterService helpCenterService;
    private final LegacyUploadService uploadService;

    public LegacyCompatibilityController(
            BookmarksService bookmarksService,
            LegacyContentstoreService contentstoreService,
            LegacyTeamService teamService,
            LegacyHelpCenterService helpCenterService,
            LegacyUploadService uploadService
    ) {
        this.bookmarksService = bookmarksService;
        this.contentstoreService = contentstoreService;
        this.teamService = teamService;
        this.helpCenterService = helpCenterService;
        this.uploadService = uploadService;
    }

    @GetMapping("/api/v1/bookmarks/")
    @RequireLogin
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
    @RequireLogin
    public ResponseEntity<?> downstreams() {
        return ResponseEntity.ok(Map.of("results", contentstoreService.listDownstreams()));
    }

    @PostMapping("/api/contentstore/v2/downstreams/{downstreamBlockId}/sync")
    @RequireLogin
    public ResponseEntity<?> downstreamSync(@PathVariable String downstreamBlockId) {
        return ResponseEntity.ok(contentstoreService.sync(downstreamBlockId));
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
    @RequireLogin
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
    @RequireLogin
    public ResponseEntity<?> profileImageUpload() {
        return ResponseEntity.ok(Map.of("uploaded", true));
    }

    @PostMapping("/api/profile_images/v0/staff/remove")
    @RequireLogin
    public ResponseEntity<?> profileImageRemove() {
        return ResponseEntity.ok(Map.of("removed", true));
    }

    @GetMapping("/api/team/v0/team_memberships/")
    @RequireLogin
    public ResponseEntity<?> teamMemberships() {
        return ResponseEntity.ok(Map.of("results", teamService.listMemberships()));
    }

    @GetMapping("/api/team/v0/team_membership/{teamId},{username}")
    @RequireLogin
    public ResponseEntity<?> teamMembership(@PathVariable String teamId, @PathVariable String username, @RequestParam(required = false) Boolean admin) {
        try {
            return ResponseEntity.ok(teamService.getMembership(teamId, username, admin != null && admin));
        } catch (LegacyTeamService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("detail", ex.getMessage()));
        }
    }

    @GetMapping("/api/team/v0/teams/")
    @RequireLogin
    public ResponseEntity<?> teams() {
        return ResponseEntity.ok(Map.of("results", teamService.listTeams()));
    }

    @GetMapping("/api/team/v0/teams/{teamId}")
    @RequireLogin
    public ResponseEntity<?> team(@PathVariable String teamId, @RequestParam(required = false) String expand) {
        try {
            return ResponseEntity.ok(teamService.getTeam(teamId, expand));
        } catch (LegacyTeamService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("detail", ex.getMessage()));
        }
    }

    @GetMapping("/api/team/v0/teams/{teamId}/assignments")
    @RequireLogin
    public ResponseEntity<?> teamAssignments(@PathVariable String teamId) {
        try {
            return ResponseEntity.ok(teamService.getTeamAssignments(teamId));
        } catch (LegacyTeamService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("detail", ex.getMessage()));
        }
    }

    @GetMapping("/api/team/v0/topics/{topicId},{courseId}")
    @RequireLogin
    public ResponseEntity<?> teamTopics(@PathVariable String topicId, @PathVariable String courseId) {
        try {
            return ResponseEntity.ok(teamService.getTopic(topicId, courseId));
        } catch (LegacyTeamService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("detail", ex.getMessage()));
        }
    }

    @GetMapping("/api/team/v0/topics/{topicId},{coursePrefix}/{courseSuffix}")
    @RequireLogin
    public ResponseEntity<?> teamTopicsWithSlash(
            @PathVariable String topicId,
            @PathVariable String coursePrefix,
            @PathVariable String courseSuffix
    ) {
        try {
            return ResponseEntity.ok(teamService.getTopic(topicId, coursePrefix + "/" + courseSuffix));
        } catch (LegacyTeamService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("detail", ex.getMessage()));
        }
    }

    @GetMapping("/api/v2/help_center/articles/search.json")
    public ResponseEntity<?> helpCenterSearch(@RequestParam(required = false) String query) {
        try {
            return ResponseEntity.ok(Map.of("results", helpCenterService.search(query), "query", query == null ? "" : query));
        } catch (LegacyHelpCenterService.ValidationException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/api/v2/uploads.json")
    public ResponseEntity<?> uploads(@RequestParam(required = false) String filename) {
        return ResponseEntity.ok(Map.of("upload", uploadService.createUpload(filename)));
    }

    @GetMapping("/api/v2/uploads/{fileToken}.json")
    public ResponseEntity<?> uploadStatus(@PathVariable String fileToken) {
        try {
            return ResponseEntity.ok(Map.of("upload", uploadService.getUpload(fileToken)));
        } catch (LegacyUploadService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("upload", Map.of("token", ex.token(), "status", "not_found")));
        }
    }

    @GetMapping("/api/legacy/media/generate_video_upload_link/{courseId}")
    @RequireLogin
    public ResponseEntity<?> generateVideoUploadLink(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of(
                "course_id", courseId,
                "upload_url", "https://uploads.local/" + courseId,
                "upload_token", "video-up-token-1"
        ));
    }

    @GetMapping("/api/legacy/media/video_images_upload_enabled")
    @RequireLogin
    public ResponseEntity<?> videoImagesUploadEnabled() {
        return ResponseEntity.ok(Map.of("enabled", true));
    }

    @GetMapping("/api/legacy/media/video_features")
    @RequireLogin
    public ResponseEntity<?> videoFeatures() {
        return ResponseEntity.ok(Map.of(
                "video_upload_enabled", true,
                "transcripts_enabled", true
        ));
    }

    @GetMapping("/api/legacy/media/transcript_preferences/{courseId}")
    @RequireLogin
    public ResponseEntity<?> transcriptPreferences(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of(
                "course_id", courseId,
                "default_language", "en",
                "provider", "internal"
        ));
    }

    @GetMapping("/api/legacy/media/transcript_credentials/{courseId}")
    @RequireLogin
    public ResponseEntity<?> transcriptCredentials(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of(
                "course_id", courseId,
                "credential_type", "service_account",
                "configured", true
        ));
    }

    @GetMapping("/api/legacy/media/video_encodings_download/{courseId}")
    @RequireLogin
    public ResponseEntity<?> videoEncodingsDownload(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of(
                "course_id", courseId,
                "encodings", List.of()
        ));
    }

    private String currentUser(HttpServletRequest request) {
        String user = request.getHeader("X-User-Id");
        return StringUtils.hasText(user) ? user : null;
    }

    private String str(Object value) {
        return value instanceof String s ? s : null;
    }
}
