CREATE TABLE IF NOT EXISTS enterprise_learner (
    username VARCHAR(128) PRIMARY KEY,
    enterprise_id VARCHAR(128) NOT NULL,
    active BOOLEAN NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
