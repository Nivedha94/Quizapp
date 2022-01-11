const express = require("express");
const router = express.Router();

router.get("/all", (req, res) => {
  res.render("results");
});

module.exports = router;
