const User = require("../models").user;
const Wallet = require("../models").wallet;
const Transaction = require("../models").transaction;
const Card = require("../models").card;
const { cardSchema } = require("../helpers/schema");

exports.requestACard = async (req, res, next) => {
  try {
    const result = await cardSchema.validateAsync(req.body);
    const userId = req.user.id;
    const { type } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Wallet,
          as: "wallet",
          attributes: ["id", "walletNumber", "balance", "amountSpent"],
        },
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }
    let amount = 0;
    if (type == "lifestyle pro") {
      amount = 500;
    } else if (type == "lifestyle premium") {
      amount = 1000;
    } else if (type == "lifestyle business") {
      amount = 1200;
    }
    if (user.wallet.balance < amount) {
      return res.status(400).send({
        status: false,
        message: "Insufficient balance",
      });
    }

    const transaction = await Transaction.create({
      amount,
      userId,
      walletId: user.wallet.walletNumber,
      title: "Request a card",
      type: "debit",
      date: new Date(),
    });

    if (!transaction) {
      return res.status(400).send({
        status: false,
        message: "Transaction failed",
      });
    }

    const newBalance = user.wallet.balance - amount;
    const amountSpent = Number(user.wallet.amountSpent) + Number(amount);
    const updatedWallet = await Wallet.update(
      {
        balance: newBalance,
        amountSpent,
      },
      {
        where: {
          id: user.wallet.id,
        },
      }
    );

    if (!updatedWallet) {
      return res.status(400).send({
        status: false,
        message: "Wallet not found",
      });
    }

    const card = await Card.create({
      userId,
      walletId: user.wallet.walletNumber,
      type,
      status: "pending",
    });

    if (!card) {
      return res.status(400).send({
        status: false,
        message: "Card not created",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Card request successfully",
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.getUserCards = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Wallet,
          as: "wallet",
          attributes: ["id", "walletNumber", "balance", "amountSpent"],
        },
        {
          model: Card,
          as: "cards",
          attributes: ["id", "type", "status"],
        },
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      status: true,
      data: user.cards,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

//this line is for admin

exports.approvecard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: Wallet,
          as: "wallet",
          attributes: ["id", "walletNumber", "balance", "amountSpent"],
        },
        {
          model: Card,
          as: "cards",
          attributes: ["id", "type", "status"],
        },
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const card = await Card.update(
      {
        status: "approved",
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!card) {
      return res.status(400).send({
        status: false,
        message: "Card not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Card approved",
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
