package org.openedx.backend.coursex.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCourseXRequest(
        @NotBlank
        @Size(max = 255)
        String parentCourseId,
        @NotBlank
        @Size(max = 255)
        String displayName,
        @NotBlank
        @Size(max = 128)
        String ownerUserId
) {
}
