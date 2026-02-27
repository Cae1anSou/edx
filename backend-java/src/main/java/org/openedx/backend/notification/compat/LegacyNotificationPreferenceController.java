package org.openedx.backend.notification.compat;

import jakarta.validation.Valid;
import org.openedx.backend.notification.application.NotificationPreferenceService;
import org.openedx.backend.notification.domain.NotificationPreference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/legacy/users/{userId}/notification-preferences")
public class LegacyNotificationPreferenceController {

    private final NotificationPreferenceService service;

    public LegacyNotificationPreferenceController(NotificationPreferenceService service) {
        this.service = service;
    }

    @GetMapping
    public LegacyNotificationPreferenceResponse getByUserId(@PathVariable String userId) {
        return toLegacyResponse(service.getByUserId(userId));
    }

    @PutMapping
    public LegacyNotificationPreferenceResponse update(
            @PathVariable String userId,
            @Valid @RequestBody LegacyNotificationPreferenceRequest request
    ) {
        NotificationPreference updated = service.upsert(userId, request.emailEnabled(), request.smsEnabled());
        return toLegacyResponse(updated);
    }

    private LegacyNotificationPreferenceResponse toLegacyResponse(NotificationPreference preference) {
        return new LegacyNotificationPreferenceResponse(
                preference.userId(),
                preference.emailEnabled(),
                preference.smsEnabled(),
                preference.updatedAt()
        );
    }
}
