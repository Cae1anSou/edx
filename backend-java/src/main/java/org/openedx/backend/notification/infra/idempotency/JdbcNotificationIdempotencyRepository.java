package org.openedx.backend.notification.infra.idempotency;

import java.util.Map;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@ConditionalOnProperty(name = "app.notification.repository", havingValue = "jdbc")
public class JdbcNotificationIdempotencyRepository implements NotificationIdempotencyRepository {

    private static final String EXISTS_SQL = """
            SELECT COUNT(1)
            FROM notification_preference_idempotency
            WHERE idempotency_key = :idempotency_key
            """;

    private static final String INSERT_SQL = """
            INSERT INTO notification_preference_idempotency (idempotency_key, user_id)
            VALUES (:idempotency_key, :user_id)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcNotificationIdempotencyRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public boolean exists(String idempotencyKey) {
        Integer count = jdbcTemplate.queryForObject(
                EXISTS_SQL,
                Map.of("idempotency_key", idempotencyKey),
                Integer.class
        );
        return count != null && count > 0;
    }

    @Override
    @Transactional
    public void save(String idempotencyKey, String userId) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("idempotency_key", idempotencyKey)
                .addValue("user_id", userId);
        jdbcTemplate.update(INSERT_SQL, params);
    }
}
