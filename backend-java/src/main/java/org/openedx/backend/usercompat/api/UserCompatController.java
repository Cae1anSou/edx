package org.openedx.backend.usercompat.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.usercompat.application.UserCompatService;
import org.openedx.backend.usercompat.application.UserCompatService.UserAccount;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserCompatController {

    private final UserCompatService service;

    public UserCompatController(UserCompatService service) {
        this.service = service;
    }

    @PostMapping("/api/user/v1/account/registration/")
    public ResponseEntity<?> registration(@RequestBody(required = false) Map<String, Object> body, HttpServletRequest request) {
        String username = string(body, "username");
        String email = string(body, "email");
        if (!StringUtils.hasText(username) || !StringUtils.hasText(email)) {
            return ResponseEntity.badRequest().body(Map.of("success", false));
        }
        UserAccount account = service.register(username, email, string(body, "name"));
        return ResponseEntity.status(201).body(service.asResponse(account, baseUrl(request)));
    }

    @PostMapping("/api/user/v1/account/login_session/")
    public ResponseEntity<?> loginSession(HttpServletRequest request) {
        String username = currentUser(request);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(Map.of("username", username, "is_active", true));
    }

    @GetMapping("/api/user/v1/accounts/")
    public ResponseEntity<?> listAccounts(HttpServletRequest request) {
        String username = currentUser(request);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        UserAccount account = service.get(username).orElseGet(() -> service.register(username, username + "@example.com", username));
        return ResponseEntity.ok(List.of(service.asResponse(account, baseUrl(request))));
    }

    @PostMapping("/api/user/v1/accounts/deactivate_logout/")
    public ResponseEntity<?> deactivateLogout() {
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/api/user/v1/preferences/email_opt_in/")
    public ResponseEntity<?> emailOptIn(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        String username = currentUser(request);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        String emailOptIn = string(body, "email_opt_in");
        String courseId = string(body, "course_id");
        if (!StringUtils.hasText(emailOptIn) || !StringUtils.hasText(courseId)) {
            return ResponseEntity.badRequest().body("Missing course_id or email_opt_in");
        }
        service.setPreference(username, "email_opt_in:" + courseId, emailOptIn);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/user/v1/preferences/{prefKey}/")
    public ResponseEntity<?> setPreference(
            HttpServletRequest request,
            @PathVariable String prefKey,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        String username = currentUser(request);
        if (username == null) {
            return ResponseEntity.status(401).build();
        }
        String value = string(body, "value");
        if (!StringUtils.hasText(value)) {
            return ResponseEntity.badRequest().body(Map.of("detail", "value is required"));
        }
        service.setPreference(username, prefKey, value);
        return ResponseEntity.ok(Map.of("username", username, "preference_key", prefKey, "value", value));
    }

    @GetMapping("/api/user/v0/accounts/{username}")
    public ResponseEntity<?> v0Account(@PathVariable String username, HttpServletRequest request) {
        UserAccount account = service.get(username).orElseGet(() -> service.register(username, username + "@example.com", username));
        return ResponseEntity.ok(service.asResponse(account, baseUrl(request)));
    }

    @GetMapping("/api/user/v0/preferences/{username}")
    public ResponseEntity<?> v0Preferences(@PathVariable String username) {
        UserAccount account = service.get(username).orElseGet(() -> service.register(username, username + "@example.com", username));
        return ResponseEntity.ok(account.preferences());
    }

    @PostMapping("/api/user/v1/validation/registration")
    public ResponseEntity<?> validateRegistration(@RequestBody(required = false) Map<String, Object> body) {
        String username = string(body, "username");
        String email = string(body, "email");
        return ResponseEntity.ok(Map.of(
                "success", StringUtils.hasText(username) && StringUtils.hasText(email),
                "username", username == null ? "" : username,
                "email", email == null ? "" : email
        ));
    }

    private String currentUser(HttpServletRequest request) {
        String user = request.getHeader("X-User-Id");
        return StringUtils.hasText(user) ? user : null;
    }

    private String string(Map<String, Object> body, String key) {
        if (body == null) {
            return null;
        }
        Object value = body.get(key);
        return value instanceof String s ? s : null;
    }

    private String baseUrl(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + (request.getServerPort() == 80 || request.getServerPort() == 443 ? "" : ":" + request.getServerPort());
    }
}
