package org.openedx.backend.studio.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openedx.backend.common.exception.BusinessException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StudioDashboardServiceTest {

    private StudioDashboardService service;

    @BeforeEach
    void setUp() {
        service = new StudioDashboardService();
    }

    @Test
    void createCourseShouldAppendCourseAndReturnUrl() {
        var created = service.createCourse("New Demo Course", "edX", "Demo", "2026");

        assertTrue(created.id().startsWith("course-"));
        assertTrue(created.url().startsWith("/course/course-v1:edX+Demo+2026"));
        assertTrue(service.dashboard().courses().stream().anyMatch(course -> course.id().equals(created.id())));
    }

    @Test
    void createLibraryShouldRejectInvalidKeyCharacters() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> service.createLibrary("Bad Library", "edX", "bad value")
        );

        assertEquals("INVALID_ARGUMENT", ex.getCode());
    }

    @Test
    void createCourseShouldRejectCombinedLengthOver65() {
        String longRun = "run".repeat(22);
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> service.createCourse("Too Long", "edX", "DemoX", longRun)
        );

        assertEquals("INVALID_ARGUMENT", ex.getCode());
        assertTrue(ex.getMessage().contains("cannot be more than 65"));
    }

    @Test
    void rerunCourseShouldRequireSourceCourseKey() {
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> service.rerunCourse("", "Rerun", "edX", "DemoX", "2026")
        );

        assertEquals("INVALID_ARGUMENT", ex.getCode());
        assertTrue(ex.getMessage().contains("source_course_key"));
    }

    @Test
    void dismissNotificationShouldRemoveItem() {
        int before = service.dashboard().notifications().size();
        service.dismissNotification("notice-seed-1");
        int after = service.dashboard().notifications().size();
        assertEquals(before - 1, after);
    }
}
