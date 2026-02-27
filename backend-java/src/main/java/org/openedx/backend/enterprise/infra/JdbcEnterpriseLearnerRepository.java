package org.openedx.backend.enterprise.infra;

import org.openedx.backend.enterprise.domain.EnterpriseLearnerRecord;
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
@ConditionalOnProperty(name = "app.enterprise.repository", havingValue = "jdbc")
public class JdbcEnterpriseLearnerRepository implements EnterpriseLearnerRepository {

    private static final String SELECT_SQL = """
            SELECT username, enterprise_id, active, updated_at
            FROM enterprise_learner
            WHERE username = :username
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO enterprise_learner (username, enterprise_id, active, updated_at)
            KEY(username)
            VALUES (:username, :enterprise_id, :active, :updated_at)
            """;

    private static final String LIST_SQL = """
            SELECT username, enterprise_id, active, updated_at
            FROM enterprise_learner
            ORDER BY updated_at DESC
            LIMIT :limit OFFSET :offset
            """;

    private static final String COUNT_SQL = "SELECT COUNT(1) FROM enterprise_learner";

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcEnterpriseLearnerRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<EnterpriseLearnerRecord> findByUsername(String username) {
        return jdbcTemplate.query(SELECT_SQL, Map.of("username", username), this::mapRow).stream().findFirst();
    }

    @Override
    @Transactional
    public EnterpriseLearnerRecord save(EnterpriseLearnerRecord record) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("username", record.username())
                .addValue("enterprise_id", record.enterpriseId())
                .addValue("active", record.active())
                .addValue("updated_at", Timestamp.from(record.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return record;
    }

    @Override
    public List<EnterpriseLearnerRecord> list(int page, int size) {
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

    private EnterpriseLearnerRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new EnterpriseLearnerRecord(
                rs.getString("username"),
                rs.getString("enterprise_id"),
                rs.getBoolean("active"),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
