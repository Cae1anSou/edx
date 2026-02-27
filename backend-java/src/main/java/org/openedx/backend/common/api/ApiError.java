package org.openedx.backend.common.api;

public record ApiError(
        String code,
        String message,
        String requestId,
        String path,
        Object details
) {
}
