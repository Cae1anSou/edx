CREATE TABLE IF NOT EXISTS user_profile (
    user_id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS enrollment_record (
    user_id VARCHAR(128) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    enrolled_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, course_id)
);
