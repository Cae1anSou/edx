package org.openedx.backend.consent.infra;

import org.openedx.backend.consent.domain.DataSharingConsentRecord;
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
@ConditionalOnProperty(name = "app.consent.repository", havingValue = "jdbc")
public class JdbcDataSharingConsentRepository implements DataSharingConsentRepository {

    private static final String SELECT_SQL = """
            SELECT username, consented, updated_at
            FROM data_sharing_consent
            WHERE username = :username
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO data_sharing_consent (username, consented, updated_at)
            KEY(username)
            VALUES (:username, :consented, :updated_at)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcDataSharingConsentRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<DataSharingConsentRecord> findByUsername(String username) {
        return jdbcTemplate.query(SELECT_SQL, Map.of("username", username), this::mapRow).stream().findFirst();
    }

    @Override
    @Transactional
    public DataSharingConsentRecord save(DataSharingConsentRecord record) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("username", record.username())
                .addValue("consented", record.consented())
                .addValue("updated_at", Timestamp.from(record.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return record;
    }

    private DataSharingConsentRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new DataSharingConsentRecord(
                rs.getString("username"),
                rs.getBoolean("consented"),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? Instant.EPOCH : ts.toInstant();
    }
}
