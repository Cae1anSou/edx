package org.openedx.backend.identity.api;

import jakarta.validation.Valid;
import org.openedx.backend.identity.application.UserProfileService;
import org.openedx.backend.identity.domain.UserProfile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserProfileController {

    private final UserProfileService service;

    public UserProfileController(UserProfileService service) {
        this.service = service;
    }

    @PostMapping
    public UserProfileResponse register(@Valid @RequestBody RegisterUserRequest request) {
        return toResponse(service.register(request.email(), request.displayName()));
    }

    @GetMapping("/{userId}")
    public UserProfileResponse getByUserId(@PathVariable String userId) {
        return toResponse(service.getByUserId(userId));
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
