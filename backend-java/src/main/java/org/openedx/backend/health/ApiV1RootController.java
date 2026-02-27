package org.openedx.backend.health;

import org.openedx.backend.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class ApiV1RootController {

    @GetMapping
    public ApiResponse<Map<String, String>> root() {
        return ApiResponse.success(Map.of("service", "backend-java", "status", "UP"));
    }
}
