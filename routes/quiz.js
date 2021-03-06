const express = require("express");
const crypto = require("crypto");
const router = express.Router();

module.exports = (db) => {
  router.get("/create", (req, res) => {
    res.render("createQuiz");
  });

  router.get("/library", (req, res) => {
    db.query(
      `SELECT title, quizzes.id, description, name, quizzes.created_at, is_public FROM quizzes, users WHERE quizzes.author_id = users.id ORDER BY quizzes.created_at DESC;`
    )
      .then((rawData) => {
        const data = rawData.rows.reduce(
          (acc, quiz) => {
            if (quiz.is_public) {
              return { ...acc, public: [...acc.public, quiz] };
            } else {
              return { ...acc, private: [...acc.private, quiz] };
            }
          },
          { public: [], private: [] }
        );
        console.log(data);
        res.render("quiz-library", { allQuizzes: data });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/create", (req, res) => {
    const { title, description, isPublic, ...data } = req.body;
    console.log(data);
    db.query(
      `Insert into quizzes (title, description, is_public, author_id, questions_and_options) values ($1, $2, $3, $4, $5)`,
      [
        title,
        description,
        isPublic === "public",
        req.cookies.userId,
        JSON.stringify(
          data.questions.map((ques) => ({
            ...ques,
            id: crypto.randomBytes(2).toString("hex"),
            options: [...ques.options, ques.correctAnswer],
          }))
        ),
      ]
    )
      .then((data) => {
        if (data.rowCount === 1) {
          res.redirect("/");
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/start/:id", (req, res) => {
    const { id } = req.params;
    db.query(
      `SELECT title, description, questions_and_options FROM quizzes WHERE id = $1`,
      [id]
    )
      .then((rawData) => {
        let data = {
          id: id,
          title: rawData.rows[0].title,
          description: rawData.rows[0].description,
          questions: rawData.rows[0].questions_and_options,
        };
        res.render("quiz-game", { quizzes: data });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/start/:id", (req, res) => {
    const { id } = req.params;
    const answers = req.body;
    db.query(`SELECT title, questions_and_options FROM quizzes WHERE id = $1`, [
      id,
    ])
      .then((rawData) => {
        const title = rawData.rows[0].title;
        const data = rawData.rows[0].questions_and_options;
        let score = data.reduce(
          (acc, ques) =>
            answers[ques.id] === ques.correctAnswer ? acc + 1 : acc,
          0
        );
        db.query(`SELECT * FROM achievements WHERE user_id = $1`, [
          req.cookies.userId,
        ]).then((rawData) => {
          let achievements = rawData.rows[0];
          let oldHistory = achievements.history;

          db.query(
            `UPDATE achievements SET trophies = $1, history = $2  WHERE user_id = $3`,
            [
              score / data.length >= 0.8
                ? achievements.trophies + 1
                : achievements.trophies,
              JSON.stringify([...oldHistory, { title, score }]),
              req.cookies.userId,
            ]
          );
        });
        res.render("quiz-result", { score });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

