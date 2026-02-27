package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LegacySupportService {

    public List<Map<String, Object>> listManageCourseTeam(String email, String username, String userId) {
        if (isBlank(email) && isBlank(username) && isBlank(userId)) {
            throw new ValidationException("Missing required query parameters. At least one of 'email', 'username', or 'user_id' is required.");
        }
        return List.of(Map.of(
                "course_id", "course-v1:edX+DemoX+2025_T1",
                "course_name", "edX Demonstration Course",
                "role", "instructor",
                "org", "edX"
        ));
    }

    public Map<String, Object> updateManageCourseTeam(Map<String, Object> body) {
        if (!(body.get("email") instanceof String email) || email.isBlank()) {
            throw new ValidationException("Missing required field: 'email' is required.");
        }
        if (!(body.get("bulk_role_operations") instanceof List<?> ops) || ops.isEmpty()) {
            throw new ValidationException("Missing or empty 'bulk_role_operations' field. Must be a non-empty list.");
        }

        ArrayList<Map<String, Object>> results = new ArrayList<>();
        for (Object op : ops) {
            if (op instanceof Map<?, ?> map) {
                Object courseId = map.get("course_id");
                Object role = map.get("role");
                Object action = map.get("action");
                LinkedHashMap<String, Object> out = new LinkedHashMap<>();
                out.put("course_id", courseId == null ? "" : String.valueOf(courseId));
                out.put("role", role == null ? "" : String.valueOf(role));
                out.put("action", action == null ? "" : String.valueOf(action));
                out.put("status", "success");
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
