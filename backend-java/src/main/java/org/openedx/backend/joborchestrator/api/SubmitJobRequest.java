package org.openedx.backend.joborchestrator.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubmitJobRequest(
        @NotBlank
        @Size(max = 64)
        String jobType,
        @NotBlank
        String payload
) {
}
