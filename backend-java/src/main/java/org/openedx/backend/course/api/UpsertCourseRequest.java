package org.openedx.backend.course.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertCourseRequest(
        @NotBlank
        @Size(max = 255)
        String title,
        @NotBlank
        @Size(max = 32)
        String status,
        @NotBlank
        @Size(max = 128)
        String ownerUserId
) {
}
