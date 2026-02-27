package org.openedx.backend.agreements.domain;

import java.time.Instant;
import java.util.Map;

public record LtiPiiSignatureRecord(
        String username,
        String courseId,
        Map<String, Object> ltiTools,
        Instant createdAt
) {
}
