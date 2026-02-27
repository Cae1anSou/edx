CREATE TABLE IF NOT EXISTS coursex_record (
    coursex_id VARCHAR(128) PRIMARY KEY,
    parent_course_id VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    owner_user_id VARCHAR(128) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
