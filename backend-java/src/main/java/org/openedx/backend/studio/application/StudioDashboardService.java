package org.openedx.backend.studio.application;

import org.openedx.backend.common.exception.BusinessException;
import org.openedx.backend.studio.domain.StudioCourseItem;
import org.openedx.backend.studio.domain.StudioLibraryItem;
import org.openedx.backend.studio.domain.StudioNotificationItem;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.regex.Pattern;

@Service
public class StudioDashboardService {

    private static final Pattern KEY_FIELD_PATTERN = Pattern.compile("^[^\\s!'()*]+$");
    private static final int MAX_SUM_KEY_LENGTH = 65;

    private final CopyOnWriteArrayList<StudioCourseItem> courses = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<StudioCourseItem> archivedCourses = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<StudioLibraryItem> libraries = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<StudioNotificationItem> notifications = new CopyOnWriteArrayList<>();

    public StudioDashboardService() {
        seed();
    }

    public StudioDashboardPayload dashboard() {
        return new StudioDashboardPayload(
                sortedCourses(courses),
                sortedCourses(archivedCourses),
                sortedLibraries(libraries),
                List.copyOf(notifications),
                new StudioPermissions(true, true, true)
        );
    }

    public List<String> organizations() {
        return List.of("edX", "DemoX", "MITx", "HarvardX");
    }

    public CreatedResource createCourse(String displayName, String org, String number, String run) {
        return createCourse(displayName, org, number, run, null);
    }

    public CreatedResource createCourse(String displayName, String org, String number, String run, String sourceCourseKey) {
        validateRequired(displayName, "display_name");
        validateKeyFields(List.of(
                new KeyField("org", org),
                new KeyField("number", number),
                new KeyField("run", run)
        ));

        String id = "course-" + UUID.randomUUID();
        String courseKey = "course-v1:" + org + "+" + number + "+" + run;
        String url = "/course/" + courseKey;

        StudioCourseItem item = new StudioCourseItem(
                id,
                courseKey,
                displayName,
                org,
                number,
                run,
                true,
                url,
                "/courses/" + courseKey + "/course",
                "/course_rerun/" + courseKey
        );
        courses.add(item);
        return new CreatedResource(id, url);
    }

    public CreatedResource rerunCourse(String sourceCourseKey, String displayName, String org, String number, String run) {
        validateRequired(sourceCourseKey, "source_course_key");
        if (!StringUtils.hasText(sourceCourseKey)) {
            throw new BusinessException(
                    "INVALID_ARGUMENT",
                    "source_course_key is required.",
                    HttpStatus.BAD_REQUEST
            );
        }
        return createCourse(displayName, org, number, run, sourceCourseKey);
    }

    public CreatedResource createLibrary(String displayName, String org, String number) {
        validateRequired(displayName, "display_name");
        validateKeyFields(List.of(
                new KeyField("org", org),
                new KeyField("number", number)
        ));

        String id = "library-" + UUID.randomUUID();
        String courseKey = "library-v1:" + org + "+" + number;
        String url = "/library/" + courseKey;

        StudioLibraryItem item = new StudioLibraryItem(
                id,
                courseKey,
                displayName,
                org,
                number,
                true,
                url
        );
        libraries.add(item);
        return new CreatedResource(id, url);
    }

    public void dismissNotification(String notificationId) {
        validateRequired(notificationId, "notification_id");
        notifications.removeIf(notification -> notification.id().equals(notificationId));
    }

    private void validateKeyFields(List<KeyField> fields) {
        int sum = 0;
        for (KeyField field : fields) {
            validateRequired(field.value(), field.name());
            if (!KEY_FIELD_PATTERN.matcher(field.value()).matches()) {
                throw new BusinessException(
                        "INVALID_ARGUMENT",
                        "Please do not use any spaces or special characters in " + field.name() + ".",
                        HttpStatus.BAD_REQUEST
                );
            }
            sum += field.value().length();
        }
        if (sum > MAX_SUM_KEY_LENGTH) {
            throw new BusinessException(
                    "INVALID_ARGUMENT",
                    "The combined length of key fields cannot be more than " + MAX_SUM_KEY_LENGTH + " characters.",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private void validateRequired(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new BusinessException(
                    "INVALID_ARGUMENT",
                    fieldName + " is required.",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private List<StudioCourseItem> sortedCourses(List<StudioCourseItem> items) {
        ArrayList<StudioCourseItem> copy = new ArrayList<>(items);
        copy.sort(Comparator.comparing(StudioCourseItem::displayName));
        return copy;
    }

    private List<StudioLibraryItem> sortedLibraries(List<StudioLibraryItem> items) {
        ArrayList<StudioLibraryItem> copy = new ArrayList<>(items);
        copy.sort(Comparator.comparing(StudioLibraryItem::displayName));
        return copy;
    }

    private void seed() {
        courses.add(new StudioCourseItem(
                "course-seed-1",
                "course-v1:edX+DemoX+2026_T1",
                "Demo Course 2026",
                "edX",
                "DemoX",
                "2026_T1",
                true,
                "/course/course-v1:edX+DemoX+2026_T1",
                "/courses/course-v1:edX+DemoX+2026_T1/course",
                "/course_rerun/course-v1:edX+DemoX+2026_T1"
        ));
        archivedCourses.add(new StudioCourseItem(
                "course-seed-2",
                "course-v1:edX+Archived+2024",
                "Archived Demo Course",
                "edX",
                "Archived",
                "2024",
                false,
                "/course/course-v1:edX+Archived+2024",
                null,
                null
        ));
        libraries.add(new StudioLibraryItem(
                "library-seed-1",
                "library-v1:edX+ContentBank",
                "Shared Content Library",
                "edX",
                "ContentBank",
                true,
                "/library/library-v1:edX+ContentBank"
        ));
        notifications.add(new StudioNotificationItem(
                "notice-seed-1",
                "Migration update",
                "Studio dashboard is now running on the new React micro-frontend."
        ));
    }

    private record KeyField(String name, String value) { }

    public record CreatedResource(String id, String url) { }

    public record StudioDashboardPayload(
            List<StudioCourseItem> courses,
            List<StudioCourseItem> archivedCourses,
            List<StudioLibraryItem> libraries,
            List<StudioNotificationItem> notifications,
            StudioPermissions permissions
    ) { }

    public record StudioPermissions(
            boolean canCreateCourse,
            boolean canCreateLibrary,
            boolean allowReruns
    ) { }
}
