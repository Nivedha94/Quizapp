const express = require("express");
const router = express.Router();

router.get("/login/:id", (req, res) => {
  const userId = req.params.id;
  console.log(req);
  res.cookie("userId", userId);
  res.redirect("/");
});

module.exports = router;
