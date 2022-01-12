// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const express = require("express");
const router = express.Router();

// import the routers
const checkAuth = require("../middleware/checkAuth");
const quizRoutes = require("./quiz");
const resultRoutes = require("./results");
const loginRoute = require("./login");

// pass the routers to express as middleware
module.exports = (db) => {
  router.use("/auth", loginRoute);
  router.use("/quiz", checkAuth, quizRoutes(db));
  router.use("/results", checkAuth, resultRoutes(db));

  // get all public quizzes
  router.get("/", checkAuth, (req, res) => {
    db.query(
      `SELECT title, description, name, quizzes.created_at, is_public FROM quizzes, users WHERE quizzes.author_id = users.id`
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
        res.render("index", { allQuizzes: data });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
