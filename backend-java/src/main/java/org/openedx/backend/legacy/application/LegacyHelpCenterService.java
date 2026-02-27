package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class LegacyHelpCenterService {

    private final List<Map<String, Object>> articles = List.of(
            Map.of("id", 1001, "title", "Account setup guide", "url", "/help/account-setup"),
            Map.of("id", 1002, "title", "Reset your password", "url", "/help/reset-password"),
            Map.of("id", 1003, "title", "Course enrollment FAQ", "url", "/help/course-enrollment")
    );

    public List<Map<String, Object>> search(String query) {
        if (!StringUtils.hasText(query)) {
            throw new ValidationException("query is required");
        }
        String normalized = query.toLowerCase(Locale.ROOT);
        return articles.stream()
                .filter(a -> String.valueOf(a.get("title")).toLowerCase(Locale.ROOT).contains(normalized))
                .toList();
    }

    public static final class ValidationException extends RuntimeException {
        public ValidationException(String message) {
            super(message);
        }
    }
}
