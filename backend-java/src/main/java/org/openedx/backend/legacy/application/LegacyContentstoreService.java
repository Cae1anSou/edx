package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LegacyContentstoreService {

    private final ConcurrentHashMap<String, DownstreamSyncRecord> syncRecords = new ConcurrentHashMap<>();

    public List<Map<String, Object>> listDownstreams() {
        return syncRecords.values().stream()
                .sorted((a, b) -> b.syncedAt().compareTo(a.syncedAt()))
                .map(r -> Map.<String, Object>of(
                        "downstream_block_id", r.downstreamBlockId(),
                        "status", r.status(),
                        "synced_at", r.syncedAt().toString()))
                .toList();
    }

    public Map<String, Object> sync(String downstreamBlockId) {
        DownstreamSyncRecord record = new DownstreamSyncRecord(downstreamBlockId, "SYNCED", Instant.now());
        syncRecords.put(downstreamBlockId, record);
        LinkedHashMap<String, Object> out = new LinkedHashMap<>();
        out.put("downstream_block_id", record.downstreamBlockId());
        out.put("status", record.status());
        out.put("synced_at", record.syncedAt().toString());
        return out;
    }

    public record DownstreamSyncRecord(String downstreamBlockId, String status, Instant syncedAt) {
    }
}
