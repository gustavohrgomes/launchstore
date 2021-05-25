const express = require("express");
const routes = express.Router();
const multer = require("../app/middlewares/multer");
const { IsUserAuthenticated } = require("../app/middlewares/session");

const ProductsController = require("../app/controllers/ProductsController");
const SearchController = require("../app/controllers/SearchController");

const ProductValidator = require("../app/validators/product");

// SEARCH
routes.get("/search", SearchController.index);

// PRODUCTS
routes.get("/create", IsUserAuthenticated, ProductsController.create);
routes.get("/:id", ProductsController.show);
routes.get("/:id/edit", IsUserAuthenticated, ProductsController.edit);

routes.post("/", IsUserAuthenticated, multer.array("photos", 6), ProductValidator.post, ProductsController.post);
routes.put("/", IsUserAuthenticated, multer.array("photos", 6), ProductValidator.put, ProductsController.put);
routes.delete("/", IsUserAuthenticated, ProductsController.delete);

module.exports = routes;
