package org.openedx.backend.studio.api;

public record StudioPermissionsResponse(
        boolean canCreateCourse,
        boolean canCreateLibrary,
        boolean allowReruns
) {
}
