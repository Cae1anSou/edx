package org.openedx.backend.enrollment.infra;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.openedx.backend.enrollment.domain.EnrollmentRecord;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@ConditionalOnProperty(name = "app.enrollment.repository", havingValue = "jdbc")
public class JdbcEnrollmentRepository implements EnrollmentRepository {

    private static final String SELECT_SQL = """
            SELECT user_id, course_id, status, enrolled_at, updated_at
            FROM enrollment_record
            WHERE user_id = :user_id
              AND course_id = :course_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO enrollment_record (user_id, course_id, status, enrolled_at, updated_at)
            KEY(user_id, course_id)
            VALUES (:user_id, :course_id, :status, :enrolled_at, :updated_at)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcEnrollmentRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<EnrollmentRecord> find(String userId, String courseId) {
        return jdbcTemplate.query(
                        SELECT_SQL,
                        Map.of("user_id", userId, "course_id", courseId),
                        this::mapRow
                ).stream()
                .findFirst();
    }

    @Override
    @Transactional
    public EnrollmentRecord save(EnrollmentRecord record) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", record.userId())
                .addValue("course_id", record.courseId())
                .addValue("status", record.status())
                .addValue("enrolled_at", Timestamp.from(record.enrolledAt()))
                .addValue("updated_at", Timestamp.from(record.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return record;
    }

    private EnrollmentRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new EnrollmentRecord(
                rs.getString("user_id"),
                rs.getString("course_id"),
                rs.getString("status"),
                toInstant(rs.getTimestamp("enrolled_at")),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp timestamp) {
        return timestamp == null ? Instant.EPOCH : timestamp.toInstant();
    }
}
