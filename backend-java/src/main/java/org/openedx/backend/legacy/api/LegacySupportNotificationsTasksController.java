package org.openedx.backend.legacy.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.legacy.application.LegacyNotificationsService;
import org.openedx.backend.legacy.application.LegacySupportService;
import org.openedx.backend.legacy.application.LegacyTasksService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class LegacySupportNotificationsTasksController {

    private final LegacyNotificationsService notificationsService;
    private final LegacySupportService supportService;
    private final LegacyTasksService tasksService;

    public LegacySupportNotificationsTasksController(
            LegacyNotificationsService notificationsService,
            LegacySupportService supportService,
            LegacyTasksService tasksService
    ) {
        this.notificationsService = notificationsService;
        this.supportService = supportService;
        this.tasksService = tasksService;
    }

    @GetMapping("/api/notifications/")
    public ResponseEntity<?> notifications(HttpServletRequest request) {
        String user = currentUser(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("results", notificationsService.list(user), "count", notificationsService.list(user).size()));
    }

    @GetMapping("/api/notifications/count/")
    public ResponseEntity<?> notificationCount(HttpServletRequest request) {
        String user = currentUser(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(notificationsService.count(user));
    }

    @PatchMapping("/api/notifications/read/")
    public ResponseEntity<?> markNotificationRead(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        String user = currentUser(request);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        String appName = body == null ? null : body.get("app_name") instanceof String s ? s : null;
        Long notificationId = body != null && body.get("notification_id") instanceof Number n ? n.longValue() : null;
        try {
            return ResponseEntity.ok(notificationsService.markRead(user, appName, notificationId));
        } catch (LegacyNotificationsService.ValidationException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (LegacyNotificationsService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/api/notifications/v2/configurations/")
    public ResponseEntity<?> notificationConfigV2() {
        return ResponseEntity.ok(notificationsService.preferencesV2());
    }

    @GetMapping("/api/notifications/v3/configurations/")
    public ResponseEntity<?> notificationConfigV3() {
        return ResponseEntity.ok(notificationsService.preferencesV3());
    }

    @GetMapping("/api/notifications/preferences/update/{username}/")
    public ResponseEntity<?> notificationPreferenceUpdateGet(@PathVariable String username) {
        return ResponseEntity.ok(notificationsService.oneClickUpdate(username));
    }

    @PostMapping("/api/notifications/preferences/update/{username}/")
    public ResponseEntity<?> notificationPreferenceUpdatePost(@PathVariable String username) {
        return ResponseEntity.ok(notificationsService.oneClickUpdate(username));
    }

    @GetMapping("/api/support/v1/manage_course_team/")
    public ResponseEntity<?> manageCourseTeamGet(
            HttpServletRequest request,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String username,
            @RequestParam(name = "user_id", required = false) String userId
    ) {
        if (currentUser(request) == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(supportService.listManageCourseTeam(email, username, userId));
        } catch (LegacySupportService.ValidationException ex) {
            return ResponseEntity.badRequest().body(Map.of("detail", ex.getMessage()));
        }
    }

    @PutMapping("/api/support/v1/manage_course_team/")
    public ResponseEntity<?> manageCourseTeamPut(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        if (currentUser(request) == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(supportService.updateManageCourseTeam(body == null ? Map.of() : body));
        } catch (LegacySupportService.ValidationException ex) {
            return ResponseEntity.badRequest().body(Map.of("detail", ex.getMessage()));
        }
    }

    @GetMapping("/api/tasks/v0/")
    public ResponseEntity<?> listTasks(HttpServletRequest request) {
        if (currentUser(request) == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("results", tasksService.list()));
    }

    @PostMapping("/api/tasks/v0/")
    public ResponseEntity<?> createTask(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        if (currentUser(request) == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.status(201).body(tasksService.create(body == null ? Map.of() : body));
    }

    @GetMapping("/api/tasks/v0/{taskId}/")
    public ResponseEntity<?> getTask(HttpServletRequest request, @PathVariable long taskId) {
        if (currentUser(request) == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(tasksService.get(taskId));
        } catch (LegacyTasksService.NotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("detail", ex.getMessage()));
        }
    }

    private String currentUser(HttpServletRequest request) {
        String user = request.getHeader("X-User-Id");
        return StringUtils.hasText(user) ? user : null;
    }
}
