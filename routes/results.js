const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/all", (req, res) => {
    db.query(`SELECT * FROM achievements WHERE user_id = $1`, [
      req.cookies.userId,
    ])
      .then((rawData) => {
        let achievements = rawData.rows[0];
        res.render("results", {
          trophies: achievements.trophies,
          history: achievements.history,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
