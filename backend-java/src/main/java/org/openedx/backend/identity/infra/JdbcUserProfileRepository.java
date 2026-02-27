package org.openedx.backend.identity.infra;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import org.openedx.backend.identity.domain.UserProfile;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@ConditionalOnProperty(name = "app.identity.repository", havingValue = "jdbc")
public class JdbcUserProfileRepository implements UserProfileRepository {

    private static final String SELECT_BY_ID = """
            SELECT user_id, email, display_name, created_at, updated_at
            FROM user_profile
            WHERE user_id = :user_id
            """;

    private static final String UPSERT_SQL = """
            MERGE INTO user_profile (user_id, email, display_name, created_at, updated_at)
            KEY(user_id)
            VALUES (:user_id, :email, :display_name, :created_at, :updated_at)
            """;

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public JdbcUserProfileRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Optional<UserProfile> findByUserId(String userId) {
        return jdbcTemplate.query(
                        SELECT_BY_ID,
                        Map.of("user_id", userId),
                        this::mapRow
                ).stream()
                .findFirst();
    }

    @Override
    @Transactional
    public UserProfile save(UserProfile userProfile) {
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("user_id", userProfile.userId())
                .addValue("email", userProfile.email())
                .addValue("display_name", userProfile.displayName())
                .addValue("created_at", Timestamp.from(userProfile.createdAt()))
                .addValue("updated_at", Timestamp.from(userProfile.updatedAt()));
        jdbcTemplate.update(UPSERT_SQL, params);
        return userProfile;
    }

    private UserProfile mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new UserProfile(
                rs.getString("user_id"),
                rs.getString("email"),
                rs.getString("display_name"),
                toInstant(rs.getTimestamp("created_at")),
                toInstant(rs.getTimestamp("updated_at"))
        );
    }

    private Instant toInstant(Timestamp timestamp) {
        return timestamp == null ? Instant.EPOCH : timestamp.toInstant();
    }
}
