package org.openedx.backend.usercompat.application;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserCompatService {

    private final ConcurrentHashMap<String, UserAccount> accounts = new ConcurrentHashMap<>();

    public UserAccount register(String username, String email, String name) {
        UserAccount existing = accounts.get(username);
        if (existing != null) {
            return existing;
        }
        UserAccount created = new UserAccount(
                "u-" + java.util.UUID.randomUUID(),
                username,
                email,
                name == null || name.isBlank() ? username : name,
                new ConcurrentHashMap<>()
        );
        accounts.put(username, created);
        return created;
    }

    public Optional<UserAccount> get(String username) {
        return Optional.ofNullable(accounts.get(username));
    }

    public void setPreference(String username, String key, String value) {
        UserAccount account = accounts.computeIfAbsent(username, this::newMinimalAccount);
        account.preferences().put(key, value);
    }

    public Map<String, Object> asResponse(UserAccount account, String baseUrl) {
        LinkedHashMap<String, Object> out = new LinkedHashMap<>();
        out.put("id", account.userId());
        out.put("url", baseUrl + "/api/user/v1/accounts/" + account.username());
        out.put("email", account.email());
        out.put("name", account.name());
        out.put("username", account.username());
        out.put("preferences", account.preferences());
        return out;
    }

    private UserAccount newMinimalAccount(String username) {
        return new UserAccount(
                "u-" + java.util.UUID.randomUUID(),
                username,
                username + "@example.com",
                username,
                new ConcurrentHashMap<>()
        );
    }

    public record UserAccount(
            String userId,
            String username,
            String email,
            String name,
            ConcurrentHashMap<String, String> preferences
    ) {
    }
}
