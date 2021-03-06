-- Drop and recreate Quizzes table
DROP TABLE
    IF EXISTS quizzes CASCADE;

CREATE TABLE
    quizzes (
        id SERIAL PRIMARY KEY NOT NULL,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(225) NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        is_public BOOLEAN NOT NULL DEFAULT TRUE,
        questions_and_options json NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );