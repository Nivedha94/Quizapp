const express = require("express");
const router = express.Router();

router.get("/create", (req, res) => {
  res.render("createQuiz");
});

router.get("/start", (req, res) => {
  res.render("startQuiz");
});

router.get("/play", (req, res) => {
  res.render("quiz-game");
});

module.exports = router;
