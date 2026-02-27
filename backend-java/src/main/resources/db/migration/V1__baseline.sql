CREATE TABLE IF NOT EXISTS notification_preference (
    user_id VARCHAR(128) PRIMARY KEY,
    email_enabled BOOLEAN NOT NULL,
    sms_enabled BOOLEAN NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
