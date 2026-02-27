CREATE TABLE IF NOT EXISTS course_metadata (
    course_id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    owner_user_id VARCHAR(128) NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS job_record (
    job_id VARCHAR(128) PRIMARY KEY,
    job_type VARCHAR(64) NOT NULL,
    payload CLOB NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
