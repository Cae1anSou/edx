package org.openedx.backend.taxonomy.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertLearnerCurrentJobRequest(
        @NotBlank
        @Size(max = 128)
        String username,
        @NotBlank
        @Size(max = 255)
        String company,
        @NotBlank
        @Size(max = 255)
        String jobTitle
) {
}
