package org.openedx.backend.langpref.api;

import jakarta.servlet.http.HttpServletRequest;
import org.openedx.backend.langpref.application.LanguagePreferenceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class LanguagePreferenceController {

    private final LanguagePreferenceService service;

    public LanguagePreferenceController(LanguagePreferenceService service) {
        this.service = service;
    }

    @PatchMapping("/lang_pref/update_language")
    public ResponseEntity<Void> updateLanguage(@RequestBody(required = false) Map<String, Object> body) {
        String language = body == null ? null : toString(body.get("pref-lang"));
        var cookie = service.buildLanguageCookie(language);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }

    @GetMapping("/update_lang/")
    public ResponseEntity<String> previewLanguage(HttpServletRequest request) {
        String userId = currentUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String html = "<html><body><h1>Preview Language Administration</h1></body></html>";
        return ResponseEntity.ok(html);
    }

    @PostMapping("/update_lang/")
    public ResponseEntity<?> updatePreviewLanguage(HttpServletRequest request, @RequestBody(required = false) Map<String, Object> body) {
        String userId = currentUser(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        String action = body == null ? null : toString(body.get("action"));
        if ("set_preview_language".equals(action)) {
            service.setPreviewLanguage(userId, body == null ? null : toString(body.get("preview_language")));
        } else if ("reset_preview_language".equals(action)) {
            service.clearPreviewLanguage(userId);
        }
        return ResponseEntity.status(302).header(HttpHeaders.LOCATION, "/update_lang/").build();
    }

    private String currentUser(HttpServletRequest request) {
        String userId = request.getHeader("X-User-Id");
        return StringUtils.hasText(userId) ? userId : null;
    }

    private String toString(Object value) {
        return value instanceof String s ? s : null;
    }
}
