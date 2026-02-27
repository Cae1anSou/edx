package org.openedx.backend.consent.api;

import org.openedx.backend.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/consent/api/v1")
public class ConsentApiRootController {

    @GetMapping
    public ApiResponse<Map<String, String>> root() {
        return ApiResponse.success(Map.of("service", "consent", "status", "UP"));
    }
}
