const crypto = require('crypto');

const User = require('../models/User');

module.exports = {
  loginForm(req, res) {
    return res.render("session/login");
  },
  login(req, res) {
    req.session.userId = req.user.id;

    return res.redirect("/users");
  },
  logout(req, res) {
    req.session.destroy();
    return res.redirect("/");
  },
  forgotForm(req, res) {
    return res.render("session/forgot-password");
  },
  forgot(req, res) {
    const { user } = req;

    // token para o usuário
    const token = crypto.randomBytes(20).toString("hex")
    
    // criar uma expiração do token
    let now = new Date()
    now.setHours(now.getHours() + 1)

    await User.update(user.id, {
      reset_token: token,
      reset_token_expires: now,
    })
    // enviar o email com um link de recuperação de senha

    // avisar o usário que enviamos o email
  },
};
