const LoadProductService = require("../services/LoadProductService");
const User = require("../models/User");

const mailer = require("../../lib/mailer");

const email = (seller, product, buyer) => `
<h2>Olá ${seller.name}</h2>
<p>Você tem um novo pedido de compra do seu produto.</p>
<p>Produto: ${product.name}</p>
<p>Preço: ${product.formatedPrice}</p>
<br/>
<br/>
<h3>Dados do comprador</h3>
<p>Nome: ${buyer.name}</p>
<p>Email: ${buyer.email}</p>
<p>Endereço: ${buyer.address}</p>
<p>CEP: ${buyer.cep}</p>
<br/>
<br/>
<p><strong>Entre em contato com o comprador para finalizar a venda.</strong></p>
<br/>
<br/>
<p>Atenciosamente, Equipe Launchstore</p>
`;

module.exports = {
  async post(req, res) {
    try {
      // pegar os dados do produto
      const product = await LoadProductService.load("product", { where: { id: req.body.id } });

      // os dados do vendedor
      const seller = await User.findOne({ where: { id: product.user_id } });

      // os dados do comprador
      const buyer = await User.findOne({ where: { id: req.session.userId } });

      // enviar o email com dados da compra para o vendedor
      await mailer.sendMail({
        to: seller.email,
        from: "no-reply@launchstore.com.br",
        subject: "Novo Pedido de compra",
        html: email(seller, product, buyer),
      });

      // notificar o usuário com alguma mensagem de sucesso
      return res.render("orders/success");
    } catch (error) {
      console.log(error);
      return res.render("orders/error");
    }
  },
};
