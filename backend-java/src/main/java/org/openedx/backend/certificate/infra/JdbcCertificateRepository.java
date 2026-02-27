package org.openedx.backend.certificate.infra;

import org.openedx.backend.certificate.domain.CertificateRecord;
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
@ConditionalOnProperty(name = "app.certificate.repository", havingValue = "jdbc")
public class JdbcCertificateRepository implements CertificateRepository {

    private static final String SELECT_SQL = """
            SELECT user_id, course_id, status, certificate_url, issued_at, updated_at
            FROM certificate_record
            WHERE user_id = :user_id
              AND course_id = :course_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO certificate_record (user_id, course_id, status, certificate_url, issued_at, updated_at)
            KEY(user_id, course_id)
            VALUES (:user_id, :course_id, :status, :certificate_url, :issued_at, :updated_at)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcCertificateRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<CertificateRecord> find(String userId, String courseId) {
        return jdbcTemplate.query(
                        SELECT_SQL,
                        Map.of("user_id", userId, "course_id", courseId),
                        this::mapRow
                ).stream()
                .findFirst();
    }

    @Override
    @Transactional
    public CertificateRecord save(CertificateRecord certificateRecord) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", certificateRecord.userId())
                .addValue("course_id", certificateRecord.courseId())
                .addValue("status", certificateRecord.status())
                .addValue("certificate_url", certificateRecord.certificateUrl())
                .addValue("issued_at", toTimestamp(certificateRecord.issuedAt()))
                .addValue("updated_at", Timestamp.from(certificateRecord.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return certificateRecord;
    }

    private CertificateRecord mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new CertificateRecord(
                rs.getString("user_id"),
                rs.getString("course_id"),
                rs.getString("status"),
                rs.getString("certificate_url"),
                toInstant(rs.getTimestamp("issued_at")),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp ts) {
        return ts == null ? null : ts.toInstant();
    }

    private Timestamp toTimestamp(Instant instant) {
        return instant == null ? null : Timestamp.from(instant);
    }
}
