package org.openedx.backend.learningprogress.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.learningprogress.domain.LearningProgress;
import org.openedx.backend.learningprogress.infra.LearningProgressRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class LearningProgressService {

    private final LearningProgressRepository repository;
    private final DomainEventPublisher eventPublisher;

    public LearningProgressService(LearningProgressRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public LearningProgress get(String userId, String courseId) {
        return repository.find(userId, courseId)
                .orElseThrow(() -> new DomainNotFoundException("Learning progress not found"));
    }

    public LearningProgress update(String userId, String courseId, int progressPercent) {
        int boundedProgress = Math.max(0, Math.min(100, progressPercent));
        LearningProgress updated = new LearningProgress(
                userId,
                courseId,
                boundedProgress,
                boundedProgress >= 100,
                Instant.now()
        );
        repository.save(updated);
        eventPublisher.publish("LearningProgressUpdated userId=" + userId + " courseId=" + courseId + " progress=" + boundedProgress);
        return updated;
    }
}
