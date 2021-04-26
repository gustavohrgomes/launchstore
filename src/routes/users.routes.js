const express = require("express");
const routes = express.Router();

const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const Validator = require("../app/validators/user");

// // Login/Logout
// routes.get("/users/login", SessionController.loginForm);
// routes.post("/users/login", SessionController.login);
// routes.post("/users/logout", SessionController.logout);

// // Reset/Forgot Password
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// // User Register
routes.get("/register", UserController.registerForm);
routes.post("/register", Validator.post, UserController.post);

// routes.get("/", UserControllers.show);
// routes.put("/", UserControllers.put);
// routes.delete("/", UserControllers.delete);

module.exports = routes;
