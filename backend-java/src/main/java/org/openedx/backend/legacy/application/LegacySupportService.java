package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LegacySupportService {

    private static final Set<String> VALID_ROLES = new HashSet<>(Arrays.asList("instructor", "staff"));
    private static final Set<String> VALID_ACTIONS = new HashSet<>(Arrays.asList("assign", "revoke"));
    private static final List<Map<String, String>> COURSE_CATALOG = List.of(
            Map.of("course_id", "course-v1:edX+DemoX+2025_T1", "course_name", "edX Demonstration Course", "org", "edX"),
            Map.of("course_id", "course-v1:edX+DemoX+2025_T2", "course_name", "edX Demonstration Course 2", "org", "edX")
    );
    private final ConcurrentHashMap<String, ConcurrentHashMap<String, String>> assignmentsByEmail = new ConcurrentHashMap<>();

    public List<Map<String, Object>> listManageCourseTeam(String email, String username, String userId) {
        if (isBlank(email) && isBlank(username) && isBlank(userId)) {
            throw new ValidationException("Missing required query parameters. At least one of 'email', 'username', or 'user_id' is required.");
        }
        String identity = !isBlank(email) ? email : (!isBlank(username) ? username + "@example.com" : userId + "@example.com");
        ConcurrentHashMap<String, String> roles = assignmentsByEmail.computeIfAbsent(identity, _k -> new ConcurrentHashMap<>());
        ArrayList<Map<String, Object>> out = new ArrayList<>();
        for (Map<String, String> course : COURSE_CATALOG) {
            String courseId = course.get("course_id");
            LinkedHashMap<String, Object> row = new LinkedHashMap<>();
            row.put("course_id", courseId);
            row.put("course_name", course.get("course_name"));
            row.put("org", course.get("org"));
            row.put("role", roles.get(courseId));
            out.add(row);
        }
        return out;
    }

    public Map<String, Object> updateManageCourseTeam(Map<String, Object> body) {
        if (!(body.get("email") instanceof String email) || email.isBlank()) {
            throw new ValidationException("Missing required field: 'email' is required.");
        }
        if (!(body.get("bulk_role_operations") instanceof List<?> ops) || ops.isEmpty()) {
            throw new ValidationException("Missing or empty 'bulk_role_operations' field. Must be a non-empty list.");
        }

        ArrayList<Map<String, Object>> results = new ArrayList<>();
        ConcurrentHashMap<String, String> byCourse = assignmentsByEmail.computeIfAbsent(email, _k -> new ConcurrentHashMap<>());
        for (Object op : ops) {
            if (op instanceof Map<?, ?> map) {
                String courseId = map.get("course_id") == null ? "" : String.valueOf(map.get("course_id"));
                String role = map.get("role") == null ? "" : String.valueOf(map.get("role"));
                String action = map.get("action") == null ? "" : String.valueOf(map.get("action"));
                LinkedHashMap<String, Object> out = new LinkedHashMap<>();
                out.put("course_id", courseId);
                out.put("role", role);
                out.put("action", action);

                if (courseId.isBlank() || !VALID_ROLES.contains(role) || !VALID_ACTIONS.contains(action)) {
                    out.put("status", "failed");
                    out.put("error", "invalid operation payload");
                } else if ("assign".equals(action)) {
                    byCourse.put(courseId, role);
                    out.put("status", "success");
                } else {
                    byCourse.remove(courseId);
                    out.put("status", "success");
                }
                results.add(out);
            }
        }
        return Map.of("email", email, "results", results);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public static final class ValidationException extends RuntimeException {
        public ValidationException(String message) { super(message); }
    }
}
