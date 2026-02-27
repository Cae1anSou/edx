CREATE TABLE IF NOT EXISTS learning_progress (
    user_id VARCHAR(128) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    progress_percent INT NOT NULL,
    completed BOOLEAN NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, course_id)
);
