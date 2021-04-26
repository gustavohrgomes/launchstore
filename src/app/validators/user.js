const User = require("../models/User");

async function post(req, res, next) {
  // check if has all fields
  const keys = Object.keys(req.body);

  for (value of keys) {
    if (req.body[value] == "") return res.send("Please, fill in all fields");
  }

  // check if user exists [email, cpf_cnpj]
  let { email, cpf_cnpj, password, passwordRepeat } = req.body;

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

  const user = await User.findOne({
    where: { email },
    or: { cpf_cnpj },
  });

  // check if password match
  if (user) return res.send("User already exists");

  if (password != passwordRepeat) {
    return res.send("Password Mismatch");
  }

  next();
}

module.exports = {
  post,
};
