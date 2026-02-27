CREATE TABLE IF NOT EXISTS grade_record (
    user_id VARCHAR(128) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    letter_grade VARCHAR(8) NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS certificate_record (
    user_id VARCHAR(128) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL,
    certificate_url VARCHAR(1024) NOT NULL,
    issued_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id, course_id)
);
