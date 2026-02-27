package org.openedx.backend.joborchestrator.infra;

import org.openedx.backend.joborchestrator.domain.JobRecord;
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
@ConditionalOnProperty(name = "app.job-orchestrator.repository", havingValue = "jdbc")
public class JdbcJobRepository implements JobRepository {

    private static final String SELECT_SQL = """
            SELECT job_id, job_type, payload, status, created_at, updated_at
            FROM job_record
            WHERE job_id = :job_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO job_record (job_id, job_type, payload, status, created_at, updated_at)
            KEY(job_id)
            VALUES (:job_id, :job_type, :payload, :status, :created_at, :updated_at)
            """;

    private static final String LIST_SQL = """
            SELECT job_id, job_type, payload, status, created_at, updated_at
            FROM job_record
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
            """;

    private static final String COUNT_SQL = "SELECT COUNT(1) FROM job_record";

    private static final String FIND_BY_STATUS_SQL = """
            SELECT job_id, job_type, payload, status, created_at, updated_at
            FROM job_record
            WHERE status = :status
            ORDER BY created_at ASC
            LIMIT :limit
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcJobRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<JobRecord> findByJobId(String jobId) {
        return jdbcTemplate.query(SELECT_SQL, Map.of("job_id", jobId), this::mapRow).stream().findFirst();
    }

    @Override
    @Transactional
    public JobRecord save(JobRecord jobRecord) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("job_id", jobRecord.jobId())
                .addValue("job_type", jobRecord.jobType())
                .addValue("payload", jobRecord.payload())
                .addValue("status", jobRecord.status())
                .addValue("created_at", Timestamp.from(jobRecord.createdAt()))
                .addValue("updated_at", Timestamp.from(jobRecord.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return jobRecord;
    }

    @Override
    public List<JobRecord> list(int page, int size) {
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

    @Override
    public List<JobRecord> findByStatus(String status, int limit) {
        return jdbcTemplate.query(
                FIND_BY_STATUS_SQL,
                Map.of("status", status, "limit", limit),
                this::mapRow
        );
    }

    private JobRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new JobRecord(
                rs.getString("job_id"),
                rs.getString("job_type"),
                rs.getString("payload"),
                rs.getString("status"),
                toInstant(rs.getTimestamp("created_at")),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
