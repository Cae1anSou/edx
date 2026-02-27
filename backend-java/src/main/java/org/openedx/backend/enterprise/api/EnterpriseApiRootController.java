package org.openedx.backend.enterprise.api;

import org.openedx.backend.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/enterprise/api/v1")
public class EnterpriseApiRootController {

    @GetMapping
    public ApiResponse<Map<String, String>> root() {
        return ApiResponse.success(Map.of("service", "enterprise", "status", "UP"));
    }
}
