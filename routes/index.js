// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const express = require("express");
const router = express.Router();

// import the routers
const checkAuth = require("./middleware/checkAuth");
const quizRoutes = require("./routes/quiz");
const resultRoutes = require("./routes/results");
const loginRoute = require("./routes/login");

// pass the routers to express as middleware
module.exports = (db) => {
  router.use("/auth", loginRoute(db));
  router.use("/quiz", checkAuth, quizRoutes);
  router.use("/results", checkAuth, resultRoutes);

  // get all public quizzes
  router.get("/", checkAuth, (req, res) => {
    res.render("index");
  });
};
