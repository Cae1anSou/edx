package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class LegacyNotificationsService {

    private final AtomicLong seq = new AtomicLong(1);
    private final ConcurrentHashMap<String, CopyOnWriteArrayList<NotificationItem>> byUser = new ConcurrentHashMap<>();

    public List<Map<String, Object>> list(String user) {
        return userItems(user).stream().map(this::toMap).toList();
    }

    public Map<String, Object> count(String user) {
        long unseen = userItems(user).stream().filter(n -> n.lastSeen() == null).count();
        return Map.of(
                "show_notifications_tray", true,
                "count", unseen,
                "count_by_app_name", Map.of("discussion", unseen),
                "notification_expiry_days", 60
        );
    }

    public Map<String, Object> markRead(String user, String appName, Long notificationId) {
        if (notificationId != null) {
            for (NotificationItem item : userItems(user)) {
                if (item.id() == notificationId) {
                    item.setLastRead(Instant.now());
                    return Map.of("message", "Notification marked read.");
                }
            }
            throw new NotFoundException("Notification not found");
        }
        if (appName == null || appName.isBlank()) {
            throw new ValidationException("Invalid app_name or notification_id.");
        }
        for (NotificationItem item : userItems(user)) {
            if (appName.equals(item.appName())) {
                item.setLastRead(Instant.now());
            }
        }
        return Map.of("message", "Notifications marked read.");
    }

    public Map<String, Object> preferencesV2() {
        return Map.of("status", "ok", "version", "v2", "apps", List.of("discussion"));
    }

    public Map<String, Object> preferencesV3() {
        return Map.of("status", "ok", "version", "v3", "apps", List.of("discussion"));
    }

    public Map<String, Object> oneClickUpdate(String username) {
        return Map.of("result", "success", "username", username);
    }

    public void seed(String user, String appName, String content) {
        userItems(user).add(new NotificationItem(seq.getAndIncrement(), appName, content, Instant.now(), null, null));
    }

    private CopyOnWriteArrayList<NotificationItem> userItems(String user) {
        return byUser.computeIfAbsent(user, _u -> {
            CopyOnWriteArrayList<NotificationItem> init = new CopyOnWriteArrayList<>();
            init.add(new NotificationItem(seq.getAndIncrement(), "discussion", "Welcome", Instant.now(), null, null));
            return init;
        });
    }

    private Map<String, Object> toMap(NotificationItem n) {
        LinkedHashMap<String, Object> out = new LinkedHashMap<>();
        out.put("id", n.id());
        out.put("app_name", n.appName());
        out.put("content", n.content());
        out.put("created", n.created().toString());
        out.put("last_read", n.lastRead() == null ? null : n.lastRead().toString());
        out.put("last_seen", n.lastSeen() == null ? null : n.lastSeen().toString());
        return out;
    }

    private static final class NotificationItem {
        private final long id;
        private final String appName;
        private final String content;
        private final Instant created;
        private Instant lastRead;
        private Instant lastSeen;

        private NotificationItem(long id, String appName, String content, Instant created, Instant lastRead, Instant lastSeen) {
            this.id = id;
            this.appName = appName;
            this.content = content;
            this.created = created;
            this.lastRead = lastRead;
            this.lastSeen = lastSeen;
        }

        public long id() { return id; }
        public String appName() { return appName; }
        public String content() { return content; }
        public Instant created() { return created; }
        public Instant lastRead() { return lastRead; }
        public Instant lastSeen() { return lastSeen; }
        public void setLastRead(Instant lastRead) { this.lastRead = lastRead; }
    }

    public static final class ValidationException extends RuntimeException {
        public ValidationException(String message) { super(message); }
    }

    public static final class NotFoundException extends RuntimeException {
        public NotFoundException(String message) { super(message); }
    }
}
