package org.openedx.backend.bookmarks.application;

import org.openedx.backend.bookmarks.domain.BookmarkRecord;
import org.openedx.backend.bookmarks.infra.BookmarkRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookmarksService {

    private final BookmarkRepository repository;
    private final int maxPerCourse;

    public BookmarksService(
            BookmarkRepository repository,
            @Value("${app.bookmarks.max-per-course:100}") int maxPerCourse
    ) {
        this.repository = repository;
        this.maxPerCourse = maxPerCourse;
    }

    public List<BookmarkRecord> list(String username, String courseId) {
        return repository.findByUser(username).stream()
                .filter(row -> courseId == null || courseId.isBlank() || row.courseId().equals(courseId))
                .sorted(Comparator.comparing(BookmarkRecord::created).reversed())
                .toList();
    }

    public Optional<BookmarkRecord> get(String username, String usageId) {
        return repository.findByUserAndUsage(username, usageId);
    }

    public BookmarkCreateResult create(String username, String usageId) {
        Optional<BookmarkRecord> existing = repository.findByUserAndUsage(username, usageId);
        if (existing.isPresent()) {
            return BookmarkCreateResult.ok(existing.get());
        }

        String courseId = deriveCourseId(usageId);
        long countInCourse = repository.findByUser(username).stream()
                .filter(row -> row.courseId().equals(courseId))
                .count();
        if (countInCourse >= maxPerCourse) {
            String msg = "You can create up to " + maxPerCourse + " bookmarks. You must remove some bookmarks before you can add new ones.";
            return BookmarkCreateResult.limitReached(msg);
        }

        if (usageId.startsWith("i4x://")) {
            return BookmarkCreateResult.blockNotFound("Block with usage_id: " + usageId + " not found.");
        }

        BookmarkRecord created = new BookmarkRecord(
                username + "," + usageId,
                username,
                courseId,
                usageId,
                deriveDisplayName(usageId),
                List.of(Map.of("usage_id", usageId, "display_name", deriveDisplayName(usageId))),
                Instant.now()
        );
        repository.save(created);
        return BookmarkCreateResult.ok(created);
    }

    public boolean delete(String username, String usageId) {
        Optional<BookmarkRecord> existing = repository.findByUserAndUsage(username, usageId);
        if (existing.isEmpty()) {
            return false;
        }
        repository.delete(username, usageId);
        return true;
    }

    public String deriveCourseId(String usageId) {
        if (usageId.startsWith("block-v1:")) {
            int idx = usageId.indexOf("+type@");
            if (idx > 0) {
                return usageId.substring(0, idx);
            }
        }
        return "course-v1-unknown";
    }

    private String deriveDisplayName(String usageId) {
        int at = usageId.lastIndexOf('@');
        if (at >= 0 && at + 1 < usageId.length()) {
            return usageId.substring(at + 1);
        }
        return usageId;
    }

    public record BookmarkCreateResult(BookmarkRecord record, String errorCode, String errorMessage) {
        static BookmarkCreateResult ok(BookmarkRecord record) {
            return new BookmarkCreateResult(record, null, null);
        }

        static BookmarkCreateResult limitReached(String errorMessage) {
            return new BookmarkCreateResult(null, "LIMIT_REACHED", errorMessage);
        }

        static BookmarkCreateResult blockNotFound(String errorMessage) {
            return new BookmarkCreateResult(null, "BLOCK_NOT_FOUND", errorMessage);
        }

        public boolean ok() {
            return record != null;
        }
    }
}
