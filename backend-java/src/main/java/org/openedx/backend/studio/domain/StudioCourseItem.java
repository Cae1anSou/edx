package org.openedx.backend.studio.domain;

public record StudioCourseItem(
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
