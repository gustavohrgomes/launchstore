const express = require("express");
const routes = express.Router();

const { IsUserLogged, IsUserAuthenticated } = require("../app/middlewares/session");

const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const UserValidator = require("../app/validators/user");
const SessionValidator = require("../app/validators/session");

// // Login/Logout
routes.get("/login", IsUserLogged, SessionController.loginForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", SessionController.logout);

// // Reset/Forgot Password
routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// // User Register
routes.get("/register", UserController.registerForm);
routes.post("/register", UserValidator.post, UserController.post);

routes.get("/", IsUserAuthenticated, UserValidator.show, UserController.show);
routes.put("/", UserValidator.update, UserController.put);
// routes.delete("/", UserControllers.delete);

module.exports = routes;
