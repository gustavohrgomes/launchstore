const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (value of keys) {
    if (body[value] == "") {
      return { user: body, error: "Por favor, preencha todos os campos." };
    }
  }
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({ where: { id } });

  if (!user) return res.render("user/register", { error: "Usuário não encontrado" });

  req.user = user;

  next();
}

async function post(req, res, next) {
  // check if has all fields
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) {
    return res.render("user/register", fillAllFields);
  }

  // check if user exists [email, cpf_cnpj]
  let { email, cpf_cnpj, password, passwordRepeat } = req.body;

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

  const user = await User.findOne({
    where: { email },
    or: { cpf_cnpj },
  });

  // check if password match
  if (user) return res.render("user/register", { user: req.body, error: "Usuário já cadastrado." });

  if (password != passwordRepeat) {
    return res.render("user/register", { user: req.body, error: "A confirmação de senha não está igual à senha digitada." });
  }

  next();
}

async function update(req, res, next) {
  // all fields
  const fillAllFields = checkAllFields(req.body);
  if (fillAllFields) {
    return res.render("user/register", fillAllFields);
  }

  // has password
  const { id, password } = req.body;

  if (!password) return res.render("user/index", { user, error: "Digite sua senha para atualizar seu cadastro." });

  // password match
  const user = await User.findOne({ where: { id } });

  const passed = await compare(password, user.password);

  if (!passed) return res.render("user/index", { user, error: "Senha incorreta." });

  req.user = user;

  next();
}

module.exports = {
  show,
  post,
  update,
};
