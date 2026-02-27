package org.openedx.backend.identity.infra;

import java.util.Optional;
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
}
