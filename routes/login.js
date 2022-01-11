const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    db.query(`SELECT id FROM users WHERE email = $1 AND password = $2`, [
      username,
      password,
    ])
      .then((data) => {
        console.log(data);
        const userId = data.rows[0].id;
        req.session.loggedIn = userId ? true : false;
        req.session.userId = userId;
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
  });

  return router;
};
