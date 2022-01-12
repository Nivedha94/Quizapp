-- Drop and recreate Achievements table
DROP TABLE
    IF EXISTS achievements CASCADE;

CREATE TABLE
    achievements (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER REFERENCES users(id),
        trophies INTEGER NOT NULL,
        history json NOT NULL
    );