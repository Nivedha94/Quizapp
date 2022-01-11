const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/all", (req, res) => {
    res.render("results");
  });

  return router;
};
