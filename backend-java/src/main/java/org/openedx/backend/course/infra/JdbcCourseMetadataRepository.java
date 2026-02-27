package org.openedx.backend.course.infra;

import org.openedx.backend.course.domain.CourseMetadata;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "app.course.repository", havingValue = "jdbc")
public class JdbcCourseMetadataRepository implements CourseMetadataRepository {

    private static final String SELECT_SQL = """
            SELECT course_id, title, status, owner_user_id, updated_at
            FROM course_metadata
            WHERE course_id = :course_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO course_metadata (course_id, title, status, owner_user_id, updated_at)
            KEY(course_id)
            VALUES (:course_id, :title, :status, :owner_user_id, :updated_at)
            """;

    private static final String LIST_SQL = """
            SELECT course_id, title, status, owner_user_id, updated_at
            FROM course_metadata
            ORDER BY updated_at DESC
            LIMIT :limit OFFSET :offset
            """;

    private static final String COUNT_SQL = "SELECT COUNT(1) FROM course_metadata";

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcCourseMetadataRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<CourseMetadata> findByCourseId(String courseId) {
        return jdbcTemplate.query(SELECT_SQL, Map.of("course_id", courseId), this::mapRow).stream().findFirst();
    }

    @Override
    @Transactional
    public CourseMetadata save(CourseMetadata metadata) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("course_id", metadata.courseId())
                .addValue("title", metadata.title())
                .addValue("status", metadata.status())
                .addValue("owner_user_id", metadata.ownerUserId())
                .addValue("updated_at", Timestamp.from(metadata.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return metadata;
    }

    @Override
    public List<CourseMetadata> list(int page, int size) {
        return jdbcTemplate.query(
                LIST_SQL,
                Map.of("limit", size, "offset", page * size),
                this::mapRow
        );
    }

    @Override
    public long count() {
        Long count = jdbcTemplate.getJdbcTemplate().queryForObject(COUNT_SQL, Long.class);
        return count == null ? 0L : count;
    }

    private CourseMetadata mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new CourseMetadata(
                rs.getString("course_id"),
                rs.getString("title"),
                rs.getString("status"),
                rs.getString("owner_user_id"),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
