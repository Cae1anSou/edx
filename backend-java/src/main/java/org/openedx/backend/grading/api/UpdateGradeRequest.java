package org.openedx.backend.grading.api;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateGradeRequest(
        @NotNull
        @Min(0)
        @Max(100)
        Double score
) {
}
