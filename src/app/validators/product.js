async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (value of keys) {
    if (req.body[value] == "") return res.send("Por favor, volte e preencha todos os campos.");
  }

  if (req.files.length == 0) {
    return res.send("Por favor, envie pelo menos 1 imagem.");
  }

  next();
}

async function put(req, res, next) {
  const keys = Object.keys(req.body);

  for (value of keys) {
    if (req.body[value] == "" && value != "removed_files") {
      return res.send("Por favor, volte e preencha todos os campos.");
    }
  }

  next();
}

module.exports = {
  post,
  put,
};
