const express = require("express");
const UserController = require("../controllers/AuthController");
const WalletController = require("../controllers/WalletController");
const TransactionController = require("../controllers/TransactionController");
const CardController = require("../controllers/CardController");
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
Router.post(
  "/fundwallet",
  passport.authenticate("jwt", { session: false }),
  WalletController.fundWallet
);

//transaction router
Router.post(
  "/transaction",
  passport.authenticate("jwt", { session: false }),
  TransactionController.performTransaction
);

Router.get(
  "/gettransactions",
  passport.authenticate("jwt", { session: false }),
  TransactionController.getUserTransactions
);

Router.get(
  "/MerchantsAnalytics",
  passport.authenticate("jwt", { session: false }),
  TransactionController.getAllMerchants
);

Router.get(
  "/categoryAnalytics",
  passport.authenticate("jwt", { session: false }),
  TransactionController.getAllCategories
);

//card router
Router.post(
  "/requestcard",
  passport.authenticate("jwt", { session: false }),
  CardController.requestACard
);

Router.get(
  "/getcards",
  passport.authenticate("jwt", { session: false }),
  CardController.getUserCards
);

module.exports = Router;
