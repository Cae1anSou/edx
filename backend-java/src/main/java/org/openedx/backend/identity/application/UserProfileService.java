package org.openedx.backend.identity.application;

import java.time.Instant;
import java.util.UUID;

import org.openedx.backend.common.api.PageResponse;
import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.identity.domain.UserProfile;
import org.openedx.backend.identity.infra.UserProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserProfileRepository repository;
    private final DomainEventPublisher eventPublisher;

    public UserProfileService(UserProfileRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public UserProfile getByUserId(String userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new DomainNotFoundException("User not found: " + userId));
    }

    public UserProfile register(String email, String displayName) {
        Instant now = Instant.now();
        UserProfile created = new UserProfile(
                "u-" + UUID.randomUUID(),
                email,
                displayName,
                now,
                now
        );
        repository.save(created);
        eventPublisher.publish("UserRegistered userId=" + created.userId());
        return created;
    }

    public PageResponse<UserProfile> list(int page, int size) {
        return new PageResponse<>(
                repository.list(page, size),
                page,
                size,
                repository.count()
        );
    }
}
