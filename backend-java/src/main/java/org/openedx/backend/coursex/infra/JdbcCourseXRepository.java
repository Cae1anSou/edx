package org.openedx.backend.coursex.infra;

import org.openedx.backend.coursex.domain.CourseXRecord;
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
@ConditionalOnProperty(name = "app.coursex.repository", havingValue = "jdbc")
public class JdbcCourseXRepository implements CourseXRepository {

    private static final String SELECT_SQL = """
            SELECT coursex_id, parent_course_id, display_name, owner_user_id, created_at, updated_at
            FROM coursex_record
            WHERE coursex_id = :coursex_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO coursex_record (coursex_id, parent_course_id, display_name, owner_user_id, created_at, updated_at)
            KEY(coursex_id)
            VALUES (:coursex_id, :parent_course_id, :display_name, :owner_user_id, :created_at, :updated_at)
            """;

    private static final String LIST_SQL = """
            SELECT coursex_id, parent_course_id, display_name, owner_user_id, created_at, updated_at
            FROM coursex_record
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
            """;

    private static final String COUNT_SQL = "SELECT COUNT(1) FROM coursex_record";

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcCourseXRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<CourseXRecord> findByCourseXId(String courseXId) {
        return jdbcTemplate.query(SELECT_SQL, Map.of("coursex_id", courseXId), this::mapRow).stream().findFirst();
    }

    @Override
    @Transactional
    public CourseXRecord save(CourseXRecord record) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("coursex_id", record.courseXId())
                .addValue("parent_course_id", record.parentCourseId())
                .addValue("display_name", record.displayName())
                .addValue("owner_user_id", record.ownerUserId())
                .addValue("created_at", Timestamp.from(record.createdAt()))
                .addValue("updated_at", Timestamp.from(record.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return record;
    }

    @Override
    public List<CourseXRecord> list(int page, int size) {
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

    private CourseXRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new CourseXRecord(
                rs.getString("coursex_id"),
                rs.getString("parent_course_id"),
                rs.getString("display_name"),
                rs.getString("owner_user_id"),
                toInstant(rs.getTimestamp("created_at")),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
