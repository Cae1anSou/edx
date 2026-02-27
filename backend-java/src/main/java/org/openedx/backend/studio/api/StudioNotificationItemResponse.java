package org.openedx.backend.studio.api;

public record StudioNotificationItemResponse(
        String id,
        String title,
        String message
) {
}
