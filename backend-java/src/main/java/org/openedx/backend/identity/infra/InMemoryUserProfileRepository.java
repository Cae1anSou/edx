package org.openedx.backend.identity.infra;

import java.util.Optional;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.openedx.backend.identity.domain.UserProfile;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

@Repository
@ConditionalOnProperty(name = "app.identity.repository", havingValue = "inmemory", matchIfMissing = true)
public class InMemoryUserProfileRepository implements UserProfileRepository {

    private final ConcurrentMap<String, UserProfile> store = new ConcurrentHashMap<>();

    @Override
    public Optional<UserProfile> findByUserId(String userId) {
        return Optional.ofNullable(store.get(userId));
    }

    @Override
    public UserProfile save(UserProfile userProfile) {
        store.put(userProfile.userId(), userProfile);
        return userProfile;
    }

    @Override
    public List<UserProfile> list(int page, int size) {
        return store.values().stream()
                .sorted(Comparator.comparing(UserProfile::createdAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }

    @Override
    public long count() {
        return store.size();
    }
}
