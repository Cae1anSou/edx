package org.openedx.backend.learningprogress.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateLearningProgressRequest(
        @NotNull
        @Min(0)
        @Max(100)
        Integer progressPercent
) {
}
