const checkAuth = (req, res, next) => {
  if (!req.session.loggedIn) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

module.exports = checkAuth;
