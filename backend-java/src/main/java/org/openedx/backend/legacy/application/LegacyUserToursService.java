package org.openedx.backend.legacy.application;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LegacyUserToursService {

    private final ConcurrentHashMap<String, UserTourState> toursByUser = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, ConcurrentHashMap<Integer, DiscussionTourState>> discussionToursByUser = new ConcurrentHashMap<>();

    public Map<String, Object> getUserTour(String username) {
        UserTourState state = toursByUser.computeIfAbsent(username, _u -> new UserTourState("not_started", true));
        return Map.of(
                "course_home_tour_status", state.courseHomeTourStatus(),
                "show_courseware_tour", state.showCoursewareTour()
        );
    }

    public void patchUserTour(String username, Map<String, Object> body) {
        UserTourState prev = toursByUser.computeIfAbsent(username, _u -> new UserTourState("not_started", true));
        String status = body.get("course_home_tour_status") instanceof String s ? s : prev.courseHomeTourStatus();
        boolean showCourseware = body.get("show_courseware_tour") instanceof Boolean b ? b : prev.showCoursewareTour();
        toursByUser.put(username, new UserTourState(status, showCourseware));
    }

    public List<Map<String, Object>> listDiscussionTours(String username) {
        ConcurrentHashMap<Integer, DiscussionTourState> byId = discussionToursByUser.computeIfAbsent(username, _u -> {
            ConcurrentHashMap<Integer, DiscussionTourState> init = new ConcurrentHashMap<>();
            init.put(1, new DiscussionTourState(1, "discussions", true));
            init.put(2, new DiscussionTourState(2, "posts", true));
            return init;
        });
        return byId.values().stream()
                .sorted((a, b) -> Integer.compare(a.id(), b.id()))
                .map(t -> Map.<String, Object>of(
                        "id", t.id(),
                        "tour_name", t.tourName(),
                        "show_tour", t.showTour()))
                .toList();
    }

    public Map<String, Object> updateDiscussionTour(String username, int tourId, Map<String, Object> body) {
        ConcurrentHashMap<Integer, DiscussionTourState> byId = discussionToursByUser.computeIfAbsent(username, _u -> new ConcurrentHashMap<>());
        DiscussionTourState current = byId.get(tourId);
        if (current == null) {
            throw new NotFoundException("Discussion tour not found");
        }
        boolean showTour = body.get("show_tour") instanceof Boolean b ? b : current.showTour();
        DiscussionTourState updated = new DiscussionTourState(current.id(), current.tourName(), showTour);
        byId.put(tourId, updated);
        return Map.of("id", updated.id(), "tour_name", updated.tourName(), "show_tour", updated.showTour());
    }

    public record UserTourState(String courseHomeTourStatus, boolean showCoursewareTour) {
    }

    public record DiscussionTourState(int id, String tourName, boolean showTour) {
    }

    public static final class NotFoundException extends RuntimeException {
        public NotFoundException(String message) {
            super(message);
        }
    }
}
