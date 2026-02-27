package org.openedx.backend.learningprogress.infra;

import org.openedx.backend.learningprogress.domain.LearningProgress;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.learning-progress.repository", havingValue = "jdbc")
public class JdbcLearningProgressRepository implements LearningProgressRepository {

    private static final String SELECT_SQL = """
            SELECT user_id, course_id, progress_percent, completed, updated_at
            FROM learning_progress
            WHERE user_id = :user_id
              AND course_id = :course_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO learning_progress (user_id, course_id, progress_percent, completed, updated_at)
            KEY(user_id, course_id)
            VALUES (:user_id, :course_id, :progress_percent, :completed, :updated_at)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcLearningProgressRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<LearningProgress> find(String userId, String courseId) {
        return jdbcTemplate.query(
                        SELECT_SQL,
                        Map.of("user_id", userId, "course_id", courseId),
                        this::mapRow
                ).stream()
                .findFirst();
    }

    @Override
    @Transactional
    public LearningProgress save(LearningProgress progress) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", progress.userId())
                .addValue("course_id", progress.courseId())
                .addValue("progress_percent", progress.progressPercent())
                .addValue("completed", progress.completed())
                .addValue("updated_at", Timestamp.from(progress.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return progress;
    }

    private LearningProgress mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new LearningProgress(
                rs.getString("user_id"),
                rs.getString("course_id"),
                rs.getInt("progress_percent"),
                rs.getBoolean("completed"),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
