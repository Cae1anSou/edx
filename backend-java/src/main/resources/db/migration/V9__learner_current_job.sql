CREATE TABLE IF NOT EXISTS learner_current_job (
    username VARCHAR(128) PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
