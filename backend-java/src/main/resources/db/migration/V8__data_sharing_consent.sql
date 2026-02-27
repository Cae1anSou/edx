CREATE TABLE IF NOT EXISTS data_sharing_consent (
    username VARCHAR(128) PRIMARY KEY,
    consented BOOLEAN NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
