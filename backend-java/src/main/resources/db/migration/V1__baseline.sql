CREATE TABLE IF NOT EXISTS notification_preference (
    user_id VARCHAR(128) PRIMARY KEY,
    email_enabled BOOLEAN NOT NULL,
    sms_enabled BOOLEAN NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_preference_idempotency (
    idempotency_key VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
