package org.openedx.backend.langpref.application;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LanguagePreferenceService {

    private final String defaultLanguage;
    private final ConcurrentHashMap<String, String> darkPreviewLanguageByUser = new ConcurrentHashMap<>();

    public LanguagePreferenceService(@Value("${app.lang-pref.default-language:en}") String defaultLanguage) {
        this.defaultLanguage = defaultLanguage;
    }

    public ResponseCookie buildLanguageCookie(String language) {
        String value = (language == null || language.isBlank()) ? defaultLanguage : language;
        return ResponseCookie.from("openedx-language-preference", value)
                .path("/")
                .httpOnly(false)
                .maxAge(Duration.ofDays(365))
                .build();
    }

    public void setPreviewLanguage(String userId, String language) {
        if (language != null && !language.isBlank()) {
            darkPreviewLanguageByUser.put(userId, language);
        }
    }

    public void clearPreviewLanguage(String userId) {
        darkPreviewLanguageByUser.remove(userId);
    }

    public Map<String, String> previewState(String userId) {
        return Map.of("preview_language", darkPreviewLanguageByUser.getOrDefault(userId, ""));
    }
}
