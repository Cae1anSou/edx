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
