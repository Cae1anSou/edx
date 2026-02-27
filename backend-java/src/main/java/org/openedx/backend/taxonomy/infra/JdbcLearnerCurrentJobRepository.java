package org.openedx.backend.taxonomy.infra;

import org.openedx.backend.taxonomy.domain.LearnerCurrentJobRecord;
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
@ConditionalOnProperty(name = "app.taxonomy.repository", havingValue = "jdbc")
public class JdbcLearnerCurrentJobRepository implements LearnerCurrentJobRepository {

    private static final String SELECT_SQL = """
            SELECT username, company, job_title, updated_at
            FROM learner_current_job
            WHERE username = :username
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO learner_current_job (username, company, job_title, updated_at)
            KEY(username)
            VALUES (:username, :company, :job_title, :updated_at)
            """;

    private static final String LIST_SQL = """
            SELECT username, company, job_title, updated_at
            FROM learner_current_job
            ORDER BY updated_at DESC
            LIMIT :limit OFFSET :offset
            """;

    private static final String COUNT_SQL = "SELECT COUNT(1) FROM learner_current_job";

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcLearnerCurrentJobRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<LearnerCurrentJobRecord> findByUsername(String username) {
        return jdbcTemplate.query(SELECT_SQL, Map.of("username", username), this::mapRow).stream().findFirst();
    }

    @Override
    @Transactional
    public LearnerCurrentJobRecord save(LearnerCurrentJobRecord record) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("username", record.username())
                .addValue("company", record.company())
                .addValue("job_title", record.jobTitle())
                .addValue("updated_at", Timestamp.from(record.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return record;
    }

    @Override
    public List<LearnerCurrentJobRecord> list(int page, int size) {
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

    private LearnerCurrentJobRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new LearnerCurrentJobRecord(
                rs.getString("username"),
                rs.getString("company"),
                rs.getString("job_title"),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
