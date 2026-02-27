package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class LegacyUploadService {

    private final ConcurrentHashMap<String, String> filesByToken = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong(1);

    public Map<String, Object> createUpload(String filename) {
        String token = "up-token-" + seq.getAndIncrement();
        String attachment = filename == null ? "" : filename;
        filesByToken.put(token, attachment);
        return Map.of("token", token, "attachment", attachment);
    }

    public Map<String, Object> getUpload(String token) {
        String attachment = filesByToken.get(token);
        if (attachment == null) {
            throw new NotFoundException(token);
        }
        LinkedHashMap<String, Object> upload = new LinkedHashMap<>();
        upload.put("token", token);
        upload.put("status", "uploaded");
        upload.put("attachment", attachment);
        return upload;
    }

    public static final class NotFoundException extends RuntimeException {
        private final String token;

        public NotFoundException(String token) {
            super("Upload not found");
            this.token = token;
        }

        public String token() {
            return token;
        }
    }
}
