function IsUserAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }

  next();
}

function IsUserLogged(req, res, next) {
  if (req.session.userId) {
    return res.redirect("/users");
  }

  next();
}

module.exports = {
  IsUserAuthenticated,
  IsUserLogged,
};
