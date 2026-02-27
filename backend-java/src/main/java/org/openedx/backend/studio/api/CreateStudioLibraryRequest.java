package org.openedx.backend.studio.api;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record CreateStudioLibraryRequest(
        @JsonProperty("display_name")
        @JsonAlias("displayName")
        @NotBlank(message = "display_name is required.") String displayName,
        @NotBlank(message = "org is required.") String org,
        @NotBlank(message = "number is required.") String number
) {
}
