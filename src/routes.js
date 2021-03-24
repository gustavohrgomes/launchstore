const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");
const ProductsController = require("./app/controllers/ProductsController");

routes.get("/", (req, res) => {
  return res.render("layout.njk");
});

// PRODUCTS
routes.get("/products/create", ProductsController.create);
routes.get("/products/:id/edit", ProductsController.edit);

routes.post("/products", multer.array("photos", 6), ProductsController.post);
routes.put("/products", multer.array("photos", 6), ProductsController.put);
routes.delete("/products", ProductsController.delete);

// Alias
routes.get("/ads/create", (req, res) => {
  return res.redirect("/products/create");
});

module.exports = routes;
