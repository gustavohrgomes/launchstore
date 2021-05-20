const crypto = require("crypto");
const { hash } = require("bcryptjs");

const User = require("../models/User");

const mailer = require("../../lib/mailer");

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
  async forgot(req, res) {
    const { user } = req;

    try {
      // token para o usuário
      const token = crypto.randomBytes(20).toString("hex");

      // criar uma expiração do token
      let now = new Date();
      now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now,
      });

      // enviar o email com um link de recuperação de senha
      await mailer.sendMail({
        to: user.email,
        from: "no-reply@launchstore.com.br",
        subject: "Recuperação de senha",
        html: `
          <h2>Esqueceu sua senha?</h2>      
          <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
          <p>
            <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
              Recuperar senha
            </a>
          </p>
        `,
      });
      // avisar o usário que enviamos o email

      return res.render("session/forgot-password", {
        success: "Verifique seu e-mail para recuperar a senha",
      });
    } catch (error) {
      console.error(error);
      return res.render("session/forgot-password", {
        error: "Algo inesperado aconteceu, tente novamente.",
      });
    }
  },
  resetForm(req, res) {
    return res.render("session/password-reset", { token: req.query.token });
  },
  async reset(req, res) {
    const { user } = req;
    const { password, token } = req.body;

    try {
      // criar novo hash de senha
      const newPassword = await hash(password, 8);

      // atualiza o usuário
      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: "",
      });

      // avisa o usuário que ele tem uma nova senha
      return res.render("session/login", {
        user: req.body,
        success: "Senha redefina com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res.render("session/password-reset", {
        token,
        user: req.body,
        error: "Algo inesperado aconteceu, tente novamente.",
      });
    }
  },
};
