package org.openedx.backend.grading.infra;

import org.openedx.backend.grading.domain.GradeRecord;
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
@ConditionalOnProperty(name = "app.grading.repository", havingValue = "jdbc")
public class JdbcGradeRepository implements GradeRepository {

    private static final String SELECT_SQL = """
            SELECT user_id, course_id, score, letter_grade, updated_at
            FROM grade_record
            WHERE user_id = :user_id
              AND course_id = :course_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO grade_record (user_id, course_id, score, letter_grade, updated_at)
            KEY(user_id, course_id)
            VALUES (:user_id, :course_id, :score, :letter_grade, :updated_at)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcGradeRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<GradeRecord> find(String userId, String courseId) {
        return jdbcTemplate.query(
                        SELECT_SQL,
                        Map.of("user_id", userId, "course_id", courseId),
                        this::mapRow
                ).stream()
                .findFirst();
    }

    @Override
    @Transactional
    public GradeRecord save(GradeRecord gradeRecord) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", gradeRecord.userId())
                .addValue("course_id", gradeRecord.courseId())
                .addValue("score", gradeRecord.score())
                .addValue("letter_grade", gradeRecord.letterGrade())
                .addValue("updated_at", Timestamp.from(gradeRecord.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return gradeRecord;
    }

    private GradeRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new GradeRecord(
                rs.getString("user_id"),
                rs.getString("course_id"),
                rs.getDouble("score"),
                rs.getString("letter_grade"),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
