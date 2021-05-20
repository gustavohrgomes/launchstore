const { unlinkSync } = require("fs");
const { hash } = require("bcryptjs");

const User = require("../models/User");
const Product = require("../models/Product");

const { formatCep, formatCpfCnpj } = require("../../lib/utils");

module.exports = {
  registerForm(req, res) {
    return res.render("user/register");
  },
  async show(req, res) {
    try {
      const { user } = req;

      user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
      user.cep = formatCep(user.cep);

      return res.render("user/index", { user });
    } catch (error) {
      throw new Error(error);
    }
  },
  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = req.body;

      password = await hash(password, 8);

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      const userId = await User.create({
        name,
        email,
        password,
        cpf_cnpj,
        cep,
        address,
      });

      req.session.userId = userId;

      return res.redirect("/users");
    } catch (error) {
      throw new Error(error);
    }
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email, cpf_cnpj, cep, address } = req.body;

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address,
      });

      return res.render("user/index", { user: req.body, success: "Conta atualizada com sucesso." });
    } catch (error) {
      res.render("user/index", { error: "Algo deu errado." });
      throw new Error(error);
    }
  },
  async delete(req, res) {
    try {
      const products = await Product.findAll({ where: { user_id: req.body.id } });

      // dos produtos, pegar todas as imagens
      const allFilesPromise = products.map(product => Product.files(product.id));

      let promiseResults = await Promise.all(allFilesPromise);

      // rodar a remoção do usuário
      await User.delete(req.body.id);
      req.session.destroy();

      // remover as imagens do sistema
      promiseResults.map(results => {
        results.rows.map(file => {
          try {
            unlinkSync(file.path);
          } catch (error) {
            throw new Error(error);
          }
        });
      });

      return res.render("session/login", {
        success: "Conta deletada com sucesso. 😎",
      });
    } catch (error) {
      console.error(error);
      return res.render("user/index", {
        user: req.body,
        error: "Algo deu errado ao deletar conta. 😥",
      });
    }
  },
};
