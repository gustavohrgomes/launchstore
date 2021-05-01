const User = require("../models/User");
const { compare } = require("bcryptjs");

async function login(req, res, next) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("session/login", {
      user: req.body,
      error: "Usuário não cadastrado",
    });
  }

  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render("session/login", {
      user,
      error: "Senha incorreta.",
    });
  }

  req.user = user;

  next();
}

async function forgot(req, res, next) {
  const { email } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.render("session/forgot-password", {
        user: req.body,
        error: "E-mail não cadastrado",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    throw new Error(error);
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("session/password-reset", {
      token,
      user: req.body,
      error: "Usuário não encontrado",
    });
  }

  // verificar se as senhas estão iguais
  if (password != passwordRepeat) {
    return res.render("session/password-reset", {
      token,
      user: req.body,
      error: "A confirmação de senha não está igual à senha digitada.",
    });
  }

  // verificar se o token é válido
  if (token != user.reset_token) {
    return res.render("session/password-reset", {
      user: req.body,
      error: "Token inválido! Solicite uma nova recuperação de senha.",
    });
  }

  // verificar se o token já expirou
  let now = new Date();
  now = now.setHours(now.getHours());

  if (now > user.reset_token_expires) {
    return res.render("session/password-reset", {
      token,
      user: req.body,
      error: "Seu token para redefinação de senha expirou.\n Faça uma nova solicitação de redefinição de senha.",
    });
  }

  req.user = user;

  next();
}

module.exports = {
  login,
  forgot,
  reset,
};
