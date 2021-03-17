const express = require("express");
const routes = express.Router();
const ProductsController = require("./app/controllers/ProductsController");

routes.get("/", (req, res) => {
  return res.render("layout.njk");
});

// PRODUCTS
routes.get("/products/create", ProductsController.create);

routes.get("/ads/create", (req, res) => {
  return res.redirect("/products/create");
});

module.exports = routes;
