const express = require("express");
const UserController = require("../controllers/AuthController");
const WalletController = require("../controllers/WalletController");
const passport = require("passport");

const Router = express.Router();

Router.use(passport.initialize());

require("../middlewares/passport");

// Authentication router
Router.post("/signup", UserController.signup);
Router.post("/login", UserController.login);

// Wallet router
Router.get(
  "/wallet",
  passport.authenticate("jwt", { session: false }),
  WalletController.getUserWallet
);

module.exports = Router;
