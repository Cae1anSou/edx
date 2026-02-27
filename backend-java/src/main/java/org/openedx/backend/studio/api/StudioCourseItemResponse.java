package org.openedx.backend.studio.api;

public record StudioCourseItemResponse(
        String id,
        String courseKey,
        String displayName,
        String org,
        String number,
        String run,
        boolean canEdit,
        String url,
        String lmsLink,
        String rerunLink
) {
}
