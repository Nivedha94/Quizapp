const checkAuth = (req, res, next) => {
  if (!req.cookies.userId) {
    res.send("You are not logged in use /auth/login/:id to login");
  } else {
    next();
  }
};

module.exports = checkAuth;
