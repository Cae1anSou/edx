package org.openedx.backend.studio.domain;

public record StudioLibraryItem(
        String id,
        String courseKey,
        String displayName,
        String org,
        String number,
        boolean canEdit,
        String url
) {
}
