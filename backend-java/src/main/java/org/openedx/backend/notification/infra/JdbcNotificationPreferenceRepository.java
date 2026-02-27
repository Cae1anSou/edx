package org.openedx.backend.notification.infra;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.openedx.backend.notification.domain.NotificationPreference;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@ConditionalOnProperty(name = "app.notification.repository", havingValue = "jdbc")
public class JdbcNotificationPreferenceRepository implements NotificationPreferenceRepository {

    private static final String SELECT_BY_USER_ID = """
            SELECT user_id, email_enabled, sms_enabled, updated_at
            FROM notification_preference
            WHERE user_id = :user_id
            """;

    private static final String INSERT_SQL = """
            INSERT INTO notification_preference (user_id, email_enabled, sms_enabled, updated_at)
            VALUES (:user_id, :email_enabled, :sms_enabled, :updated_at)
            """;

    private static final String UPDATE_SQL = """
            UPDATE notification_preference
            SET email_enabled = :email_enabled,
                sms_enabled = :sms_enabled,
                updated_at = :updated_at
            WHERE user_id = :user_id
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcNotificationPreferenceRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<NotificationPreference> findByUserId(String userId) {
        return jdbcTemplate.query(
                        SELECT_BY_USER_ID,
                        Map.of("user_id", userId),
                        this::mapRow
                ).stream()
                .findFirst();
    }

    @Override
    @Transactional
    public NotificationPreference save(NotificationPreference preference) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", preference.userId())
                .addValue("email_enabled", preference.emailEnabled())
                .addValue("sms_enabled", preference.smsEnabled())
                .addValue("updated_at", Timestamp.from(preference.updatedAt()));

        int updatedRows = jdbcTemplate.update(UPDATE_SQL, params);
        if (updatedRows == 0) {
            jdbcTemplate.update(INSERT_SQL, params);
        }
        return preference;
    }

    private NotificationPreference mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return new NotificationPreference(
                resultSet.getString("user_id"),
                resultSet.getBoolean("email_enabled"),
                resultSet.getBoolean("sms_enabled"),
                toInstant(resultSet.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp timestamp) {
        return timestamp == null ? Instant.EPOCH : timestamp.toInstant();
    }
}
