package org.openedx.backend.bookmarks.domain;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record BookmarkRecord(
        String id,
        String username,
        String courseId,
        String usageId,
        String displayName,
        List<Map<String, String>> path,
        Instant created
) {
}
