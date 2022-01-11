-- Quizzes table seeds here
INSERT INTO
    quizzes (
        title,
        description,
        author_id,
        questions_and_options
    )
VALUES (
        'Test Quiz',
        'This is a test quiz',
        1,
        '[{"name":"test"},{"name":"test2"}]'
    );