package org.openedx.backend.studio.api;

public record StudioLibraryItemResponse(
        String id,
        String courseKey,
        String displayName,
        String org,
        String number,
        boolean canEdit,
        String url
) {
}
