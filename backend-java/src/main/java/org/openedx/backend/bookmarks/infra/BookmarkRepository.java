package org.openedx.backend.bookmarks.infra;

import org.openedx.backend.bookmarks.domain.BookmarkRecord;

import java.util.List;
import java.util.Optional;

public interface BookmarkRepository {
    Optional<BookmarkRecord> findByUserAndUsage(String username, String usageId);

    List<BookmarkRecord> findByUser(String username);

    BookmarkRecord save(BookmarkRecord record);

    void delete(String username, String usageId);
}
