const express = require("express");
const crypto = require("crypto");
const router = express.Router();

module.exports = (db) => {
  router.get("/create", (req, res) => {
    res.render("createQuiz");
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
        req.session.userId,
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
        let data = rawData.rows.map((data) => ({
          title: data.title,
          description: data.description,
          questions: data.questions_and_options,
        }));
        console.log(data[0].questions);
        res.render("quiz-game", { quizzes: data });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/start/:id", (req, res) => {
    const { id } = req.params;
    db.query(`SELECT  questions_and_options FROM quizzes WHERE id = $1`, [id])
      .then((rawData) => {
        const data = JSON.parse(rawData.rows[0].questions_and_options);
        let correctAnswers = data.questions.reduce((acc, ques, index) => {}, 0);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
