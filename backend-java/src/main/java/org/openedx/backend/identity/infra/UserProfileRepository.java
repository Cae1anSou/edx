package org.openedx.backend.identity.infra;

import java.util.Optional;
import java.util.List;

import org.openedx.backend.identity.domain.UserProfile;

public interface UserProfileRepository {

    Optional<UserProfile> findByUserId(String userId);

    UserProfile save(UserProfile userProfile);

    List<UserProfile> list(int page, int size);

    long count();
}
