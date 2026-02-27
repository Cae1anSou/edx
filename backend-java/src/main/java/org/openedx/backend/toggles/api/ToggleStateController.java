package org.openedx.backend.toggles.api;

import org.openedx.backend.common.exception.ForbiddenException;
import org.openedx.backend.common.security.AuthContext;
import org.openedx.backend.common.security.AuthContextResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ToggleStateController {

    private final AuthContextResolver authContextResolver;

    public ToggleStateController(AuthContextResolver authContextResolver) {
        this.authContextResolver = authContextResolver;
    }

    @GetMapping("/api/toggles/v0/state/")
    public Map<String, Object> state() {
        AuthContext auth = authContextResolver.require();
        if (!isStaff(auth)) {
            throw new ForbiddenException("Staff access required");
        }
        Map<String, Object> settingToggle = Map.of(
                "name", "FEATURES['MILESTONES_APP']",
                "is_active", true,
                "module", "common.djangoapps.util.milestones_helpers",
                "class", "SettingDictToggle"
        );
        return Map.of(
                "django_settings", List.of(settingToggle),
                "waffle_flags", List.of()
        );
    }

    private boolean isStaff(AuthContext auth) {
        return auth.hasRole("STAFF") || auth.hasRole("ADMIN") || auth.hasRole("GLOBAL_STAFF");
    }
}
