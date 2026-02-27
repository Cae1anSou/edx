package org.openedx.backend.enterprise.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertEnterpriseLearnerRequest(
        @NotBlank
        @Size(max = 128)
        String username,
        @NotBlank
        @Size(max = 128)
        String enterpriseId,
        boolean active
) {
}
