package org.openedx.backend.courseexperience.application;

import org.openedx.backend.course.infra.CourseMetadataRepository;
import org.openedx.backend.enrollment.domain.EnrollmentRecord;
import org.openedx.backend.enrollment.infra.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CourseExperienceService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseMetadataRepository courseMetadataRepository;
    private final ConcurrentHashMap<String, Instant> deadlineResetState = new ConcurrentHashMap<>();

    public CourseExperienceService(
            EnrollmentRepository enrollmentRepository,
            CourseMetadataRepository courseMetadataRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseMetadataRepository = courseMetadataRepository;
    }

    public Map<String, Object> resetCourseDeadlines(String userId, String courseKey) {
        deadlineResetState.put(key(userId, courseKey), Instant.now());
        String link = "/learning/course/" + courseKey + "#dates";
        return Map.of(
                "body", "<a href=\"" + link + "\">View all dates</a>",
                "header", "Your due dates have been successfully shifted to help you stay on track.",
                "link", link,
                "link_text", "View all dates",
                "message", "Deadlines successfully reset."
        );
    }

    public Map<String, List<String>> resetAllCourseDeadlines(String userId) {
        List<String> courseKeys = enrollmentRepository.findByUser(userId).stream()
                .filter(row -> "ENROLLED".equals(row.status()))
                .map(EnrollmentRecord::courseId)
                .toList();

        List<String> success = new java.util.ArrayList<>();
        List<String> failed = new java.util.ArrayList<>();
        for (String courseKey : courseKeys) {
            try {
                resetCourseDeadlines(userId, courseKey);
                success.add(courseKey);
            } catch (RuntimeException ex) {
                failed.add(courseKey);
            }
        }
        return Map.of("success_course_keys", success, "failed_course_keys", failed);
    }

    public boolean courseVisibleForUser(String userId, String courseKey) {
        boolean hasEnrollment = enrollmentRepository.find(userId, courseKey).isPresent();
        boolean hasCourse = courseMetadataRepository.findByCourseId(courseKey).isPresent();
        return hasEnrollment || hasCourse;
    }

    public Map<String, Object> mobileDeadlinesInfo(String userId, String courseKey) {
        boolean missedDeadlines = deadlineResetState.containsKey(key(userId, courseKey));
        return Map.of(
                "dates_banner_info", Map.of(
                        "missed_deadlines", missedDeadlines,
                        "missed_gated_content", false,
                        "content_type_gating_enabled", false,
                        "verified_upgrade_link", ""
                )
        );
    }

    private String key(String userId, String courseKey) {
        return userId + "::" + courseKey;
    }
}
