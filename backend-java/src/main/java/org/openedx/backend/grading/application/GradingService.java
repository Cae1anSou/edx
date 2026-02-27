package org.openedx.backend.grading.application;

import org.openedx.backend.common.api.DomainNotFoundException;
import org.openedx.backend.common.event.DomainEventPublisher;
import org.openedx.backend.grading.domain.GradeRecord;
import org.openedx.backend.grading.infra.GradeRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class GradingService {

    private final GradeRepository repository;
    private final DomainEventPublisher eventPublisher;

    public GradingService(GradeRepository repository, DomainEventPublisher eventPublisher) {
        this.repository = repository;
        this.eventPublisher = eventPublisher;
    }

    public GradeRecord get(String userId, String courseId) {
        return repository.find(userId, courseId)
                .orElseThrow(() -> new DomainNotFoundException("Grade not found"));
    }

    public GradeRecord upsert(String userId, String courseId, double score) {
        double boundedScore = Math.max(0.0D, Math.min(100.0D, score));
        GradeRecord updated = new GradeRecord(
                userId,
                courseId,
                boundedScore,
                toLetterGrade(boundedScore),
                Instant.now()
        );
        repository.save(updated);
        eventPublisher.publish("GradeUpdated userId=" + userId + " courseId=" + courseId + " score=" + boundedScore);
        return updated;
    }

    private String toLetterGrade(double score) {
        if (score >= 90) {
            return "A";
        }
        if (score >= 80) {
            return "B";
        }
        if (score >= 70) {
            return "C";
        }
        if (score >= 60) {
            return "D";
        }
        return "F";
    }
}
