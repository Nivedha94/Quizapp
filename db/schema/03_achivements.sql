-- Drop and recreate Achivements table
DROP TABLE
    IF EXISTS achivements CASCADE;

CREATE TABLE
    achivements (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER REFERENCES users(id),
        trophies INTEGER NOT NULL,
        history json NOT NULL
    );