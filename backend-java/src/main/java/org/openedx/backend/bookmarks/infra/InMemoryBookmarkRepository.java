package org.openedx.backend.bookmarks.infra;

import org.openedx.backend.bookmarks.domain.BookmarkRecord;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryBookmarkRepository implements BookmarkRepository {

    private final ConcurrentHashMap<String, BookmarkRecord> store = new ConcurrentHashMap<>();

    @Override
    public Optional<BookmarkRecord> findByUserAndUsage(String username, String usageId) {
        return Optional.ofNullable(store.get(key(username, usageId)));
    }

    @Override
    public List<BookmarkRecord> findByUser(String username) {
        List<BookmarkRecord> out = new ArrayList<>();
        for (BookmarkRecord row : store.values()) {
            if (row.username().equals(username)) {
                out.add(row);
            }
        }
        return out;
    }

    @Override
    public BookmarkRecord save(BookmarkRecord record) {
        store.put(key(record.username(), record.usageId()), record);
        return record;
    }

    @Override
    public void delete(String username, String usageId) {
        store.remove(key(username, usageId));
    }

    private String key(String username, String usageId) {
        return username + "::" + usageId;
    }
}
