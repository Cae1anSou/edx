package org.openedx.backend.notification.api;

import jakarta.validation.Valid;
import org.openedx.backend.common.api.ApiResponse;
import org.openedx.backend.common.security.annotation.RequireLogin;
import org.openedx.backend.common.security.annotation.RequirePermission;
import org.openedx.backend.notification.application.NotificationPreferenceService;
import org.openedx.backend.notification.domain.NotificationPreference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/api/v1/notification-preferences")
public class NotificationPreferenceController {

    private final NotificationPreferenceService service;

    public NotificationPreferenceController(NotificationPreferenceService service) {
        this.service = service;
    }

    @GetMapping("/{userId}")
    @RequireLogin
    @RequirePermission("notification:read")
    public ApiResponse<NotificationPreferenceResponse> getByUserId(@PathVariable String userId) {
        return ApiResponse.success(toResponse(service.getByUserId(userId)));
    }

    @PutMapping("/{userId}")
    @RequirePermission("notification:write")
    public ApiResponse<NotificationPreferenceResponse> update(
            @PathVariable String userId,
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody UpdateNotificationPreferenceRequest request
    ) {
        NotificationPreference updated = service.upsert(
                userId,
                request.emailEnabled(),
                request.smsEnabled(),
                idempotencyKey
        );
        return ApiResponse.success(toResponse(updated));
    }

    private NotificationPreferenceResponse toResponse(NotificationPreference preference) {
        return new NotificationPreferenceResponse(
                preference.userId(),
                preference.emailEnabled(),
                preference.smsEnabled(),
                preference.updatedAt()
        );
    }
}
