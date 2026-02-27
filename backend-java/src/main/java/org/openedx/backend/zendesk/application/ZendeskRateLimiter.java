package org.openedx.backend.zendesk.application;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ZendeskRateLimiter {

    private static final int LIMIT_PER_HOUR = 50;
    private static final Duration WINDOW = Duration.ofHours(1);
    private final ConcurrentHashMap<String, CounterWindow> counters = new ConcurrentHashMap<>();

    public boolean allow(String key) {
        Instant now = Instant.now();
        CounterWindow updated = counters.compute(key, (k, current) -> {
            if (current == null || now.isAfter(current.windowStart.plus(WINDOW))) {
                return new CounterWindow(now, 1);
            }
            return new CounterWindow(current.windowStart, current.count + 1);
        });
        return updated.count <= LIMIT_PER_HOUR;
    }

    private record CounterWindow(Instant windowStart, int count) {
    }
}
