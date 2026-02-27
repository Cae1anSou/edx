package org.openedx.backend.studio.domain;

public record StudioNotificationItem(
        String id,
        String title,
        String message
) {
}
