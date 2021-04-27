const User = require("../models/User");

module.exports = {
  registerForm(req, res) {
    return res.render("user/register");
  },
  async show(req, res) {
    return res.send("Usuário cadastrado");
  },
  async post(req, res) {
    const userId = await User.create(req.body);

    req.session.userId = userId;

    return res.redirect("/users");
  },
};
