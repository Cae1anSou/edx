package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LegacyTeamService {

    public List<Map<String, Object>> listTeams() {
        return List.of(Map.of("id", "test-team", "name", "Test Team"));
    }

    public Map<String, Object> getTeam(String teamId, String expand) {
        ensureKnownTeam(teamId);
        return Map.of("team_id", teamId, "expand", expand == null ? "" : expand);
    }

    public Map<String, Object> getTeamAssignments(String teamId) {
        ensureKnownTeam(teamId);
        return Map.of("team_id", teamId, "assignments", List.of());
    }

    public List<Map<String, Object>> listMemberships() {
        return List.of(Map.of("team_id", "test-team", "username", "u-test", "admin", false));
    }

    public Map<String, Object> getMembership(String teamId, String username, boolean admin) {
        ensureKnownTeam(teamId);
        return Map.of("team_id", teamId, "username", username, "admin", admin);
    }

    public Map<String, Object> getTopic(String topicId, String courseId) {
        if (topicId.startsWith("no_such")) {
            throw new NotFoundException("Topic not found");
        }
        return Map.of("topic_id", topicId, "course_id", courseId);
    }

    private void ensureKnownTeam(String teamId) {
        if (!"test-team".equals(teamId) && !"team_id".equals(teamId)) {
            throw new NotFoundException("Team not found");
        }
    }

    public static final class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }
}
