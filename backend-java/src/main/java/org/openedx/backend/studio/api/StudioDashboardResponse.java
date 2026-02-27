package org.openedx.backend.studio.api;

import java.util.List;

public record StudioDashboardResponse(
        List<StudioCourseItemResponse> courses,
        List<StudioCourseItemResponse> archivedCourses,
        List<StudioLibraryItemResponse> libraries,
        List<StudioNotificationItemResponse> notifications,
        StudioPermissionsResponse permissions
) {
}
