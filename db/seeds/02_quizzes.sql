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
        '[{"question":"test 123 123","correctAnswer":"test cr","options":["test 23","test 45","test 67","test cr"],"id":"82cf"}]'
    );