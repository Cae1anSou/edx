package org.openedx.backend.bookmarks.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.bookmarks.application.BookmarksService;
import org.openedx.backend.bookmarks.domain.BookmarkRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks/v1/bookmarks")
public class BookmarksController {

    private static final String DEFAULT_USER_MESSAGE = "An error has occurred. Please try again.";
    private final BookmarksService service;

    public BookmarksController(BookmarksService service) {
        this.service = service;
    }

    @GetMapping({"", "/"})
    public ResponseEntity<?> list(
            HttpServletRequest request,
            @RequestParam(required = false, name = "course_id") String courseId,
            @RequestParam(required = false, defaultValue = "") String fields,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10", name = "page_size") int pageSize
    ) {
        String username = currentUserOrNull(request);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        int sanitizedPageSize = pageSize <= 0 ? 10 : Math.min(pageSize, 100);
        int sanitizedPage = page <= 0 ? 1 : page;

        List<BookmarkRecord> rows = service.list(username, courseId);
        int total = rows.size();
        int numPages = Math.max((int) Math.ceil((double) total / sanitizedPageSize), 1);
        int start = (sanitizedPage - 1) * sanitizedPageSize;
        int end = Math.min(start + sanitizedPageSize, total);
        List<BookmarkRecord> pageRows = start >= total ? List.of() : rows.subList(start, end);

        java.util.LinkedHashMap<String, Object> body = new java.util.LinkedHashMap<>();
        body.put("count", total);
        body.put("next", sanitizedPage < numPages ? "?page=" + (sanitizedPage + 1) + "&page_size=" + sanitizedPageSize : null);
        body.put("previous", sanitizedPage > 1 ? "?page=" + (sanitizedPage - 1) + "&page_size=" + sanitizedPageSize : null);
        body.put("num_pages", numPages);
        body.put("current_page", sanitizedPage);
        body.put("start", start);
        body.put("results", pageRows.stream().map(row -> toResponse(row, fields)).toList());
        return ResponseEntity.ok(body);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<?> create(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> data) {
        String username = currentUserOrNull(request);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest().body(error("No data provided.", DEFAULT_USER_MESSAGE));
        }
        Object usageIdRaw = data.get("usage_id");
        if (!(usageIdRaw instanceof String usageId) || !StringUtils.hasText(usageId)) {
            return ResponseEntity.badRequest().body(error("Parameter usage_id not provided.", DEFAULT_USER_MESSAGE));
        }
        if (!isValidUsageId(usageId)) {
            return ResponseEntity.badRequest().body(error("Invalid usage_id: " + usageId + ".", DEFAULT_USER_MESSAGE));
        }
        BookmarksService.BookmarkCreateResult result = service.create(username, usageId);
        if (!result.ok()) {
            if ("BLOCK_NOT_FOUND".equals(result.errorCode())) {
                return ResponseEntity.badRequest().body(error(result.errorMessage(), DEFAULT_USER_MESSAGE));
            }
            if ("LIMIT_REACHED".equals(result.errorCode())) {
                return ResponseEntity.badRequest().body(error(result.errorMessage(), result.errorMessage()));
            }
        }
        return ResponseEntity.status(201).body(toResponse(result.record(), "display_name,path"));
    }

    @GetMapping({"/{username},{usageId:.+}", "/{username},{usageId:.+}/"})
    public ResponseEntity<?> getOne(
            HttpServletRequest request,
            @PathVariable String username,
            @PathVariable String usageId,
            @RequestParam(required = false, defaultValue = "") String fields
    ) {
        String requestUser = currentUserOrNull(request);
        if (requestUser == null) {
            return ResponseEntity.status(401).build();
        }
        if (!username.equals(requestUser)) {
            return ResponseEntity.status(403).build();
        }
        if (!isValidUsageId(usageId)) {
            return ResponseEntity.status(404).body(error("Invalid usage_id: " + usageId + ".", "Invalid usage_id: " + usageId + "."));
        }
        return service.get(username, usageId)
                .<ResponseEntity<?>>map(row -> ResponseEntity.ok(toResponse(row, fields)))
                .orElseGet(() -> ResponseEntity.status(404).body(
                        error(
                                "Bookmark with usage_id: " + usageId + " does not exist.",
                                "Bookmark with usage_id: " + usageId + " does not exist."
                        )));
    }

    @DeleteMapping({"/{username},{usageId:.+}", "/{username},{usageId:.+}/"})
    public ResponseEntity<?> delete(
            HttpServletRequest request,
            @PathVariable String username,
            @PathVariable String usageId
    ) {
        String requestUser = currentUserOrNull(request);
        if (requestUser == null) {
            return ResponseEntity.status(401).build();
        }
        if (!username.equals(requestUser)) {
            return ResponseEntity.status(403).build();
        }
        if (!isValidUsageId(usageId)) {
            return ResponseEntity.status(404).body(error("Invalid usage_id: " + usageId + ".", "Invalid usage_id: " + usageId + "."));
        }
        boolean deleted = service.delete(username, usageId);
        if (!deleted) {
            return ResponseEntity.status(404).body(
                    error(
                            "Bookmark with usage_id: " + usageId + " does not exist.",
                            "Bookmark with usage_id: " + usageId + " does not exist."
                    )
            );
        }
        return ResponseEntity.noContent().build();
    }

    private String currentUserOrNull(HttpServletRequest request) {
        String userId = request.getHeader("X-User-Id");
        return StringUtils.hasText(userId) ? userId : null;
    }

    private boolean isValidUsageId(String usageId) {
        return usageId.contains("://") || usageId.contains(":");
    }

    private Map<String, String> error(String developer, String user) {
        return Map.of("developer_message", developer, "user_message", user);
    }

    private Map<String, Object> toResponse(BookmarkRecord row, String fields) {
        boolean includeDisplayName = fields.contains("display_name");
        boolean includePath = fields.contains("path");
        java.util.LinkedHashMap<String, Object> out = new java.util.LinkedHashMap<>();
        out.put("id", row.id());
        out.put("course_id", row.courseId());
        out.put("usage_id", row.usageId());
        if (includeDisplayName) {
            out.put("display_name", row.displayName());
        }
        if (includePath) {
            out.put("path", row.path());
        }
        out.put("created", row.created().toString());
        return out;
    }
}
