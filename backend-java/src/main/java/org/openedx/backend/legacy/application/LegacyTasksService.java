package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class LegacyTasksService {

    private final AtomicLong seq = new AtomicLong(1);
    private final ConcurrentHashMap<Long, TaskItem> tasks = new ConcurrentHashMap<>();

    public List<Map<String, Object>> list() {
        return tasks.values().stream().sorted((a, b) -> Long.compare(a.id(), b.id())).map(this::toMap).toList();
    }

    public Map<String, Object> create(Map<String, Object> body) {
        String taskType = body.get("task_type") instanceof String s ? s : "unknown";
        long id = seq.getAndIncrement();
        TaskItem item = new TaskItem(id, taskType, "PENDING", Instant.now());
        tasks.put(id, item);
        return toMap(item);
    }

    public Map<String, Object> get(long id) {
        TaskItem item = tasks.get(id);
        if (item == null) {
            throw new NotFoundException("Task not found");
        }
        return toMap(item);
    }

    private Map<String, Object> toMap(TaskItem item) {
        LinkedHashMap<String, Object> out = new LinkedHashMap<>();
        out.put("id", item.id());
        out.put("task_type", item.taskType());
        out.put("state", item.state());
        out.put("created", item.created().toString());
        return out;
    }

    public record TaskItem(long id, String taskType, String state, Instant created) {
    }

    public static final class NotFoundException extends RuntimeException {
        public NotFoundException(String message) { super(message); }
    }
}
