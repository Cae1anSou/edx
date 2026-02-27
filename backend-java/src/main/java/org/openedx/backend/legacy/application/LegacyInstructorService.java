package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LegacyInstructorService {

    public Map<String, Object> v1Summary(String courseId) {
        return Map.of(
                "course_id", courseId,
                "features", List.of("enrollment", "data_download", "email"),
                "can_view", true
        );
    }

    public Map<String, Object> v2CourseInfo(String courseId) {
        return Map.of(
                "course_id", courseId,
                "display_name", "Demo Course",
                "enrollment_count", 0,
                "has_scheduled_content", false
        );
    }

    public Map<String, Object> v2InstructorTasks(String courseId, String problemLocation) {
        return Map.of(
                "course_id", courseId,
                "problem_location_str", problemLocation == null ? "" : problemLocation,
                "results", List.of()
        );
    }
}
