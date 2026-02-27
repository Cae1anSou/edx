package org.openedx.backend.identity.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.security.annotation.RequireLogin;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.identity.application.UserProfileService;
import org.openedx.backend.identity.domain.UserProfile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/v1/users")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @PostMapping
    @RequirePermission("identity:user:create")
    public ApiResponse<UserProfileResponse> register(@Valid @RequestBody RegisterUserRequest request) {
        return ApiResponse.success(toResponse(service.register(request.email(), request.displayName())));
    }

    @GetMapping("/{userId}")
    @RequireLogin
    public ApiResponse<UserProfileResponse> getByUserId(@PathVariable String userId) {
        return ApiResponse.success(toResponse(service.getByUserId(userId)));
    }

    @GetMapping
    @RequirePermission("identity:user:list")
    public ApiResponse<PageResponse<UserProfileResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<UserProfile> users = service.list(page, size);
        PageResponse<UserProfileResponse> mapped = new PageResponse<>(
                users.items().stream().map(this::toResponse).toList(),
                users.page(),
                users.size(),
                users.total()
        );
        return ApiResponse.success(mapped);
    }

    private UserProfileResponse toResponse(UserProfile profile) {
        return new UserProfileResponse(
                profile.userId(),
                profile.email(),
                profile.displayName(),
                profile.createdAt(),
                profile.updatedAt()
        );
    }
}
