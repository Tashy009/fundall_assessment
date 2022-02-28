const User = require("../models").user;
const Wallet = require("../models").wallet;
const Transaction = require("../models").transaction;
const { performTransactionSchema } = require("../helpers/schema");
const sequelize = require("sequelize");

exports.performTransaction = async (req, res, next) => {
  try {
    const result = await performTransactionSchema.validateAsync(req.body);
    const userId = req.user.id;
    const { amount, merchant, category, title } = req.body;
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
      merchant,
      category,
      title,
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

    return res.status(200).send({
      status: true,
      message: "Transaction successful",
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.getUserTransactions = async (req, res, next) => {
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
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        walletId: user.wallet.walletNumber,
      },
      order: [["date", "DESC"]],
    });

    if (!transactions) {
      return res.status(400).send({
        status: false,
        message: "No transactions found",
      });
    }

    return res.status(200).send({
      status: true,
      data: transactions,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.getTransactionBytype = async (req, res, next) => {
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
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        walletId: user.wallet.walletNumber,
        type: req.params.type,
      },
      order: [["date", "DESC"]],
    });

    if (!transactions) {
      return res.status(400).send({
        status: false,
        message: "No transactions found",
      });
    }

    return res.status(200).send({
      status: true,
      data: transactions,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.getAllMerchants = async (req, res, next) => {
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
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        walletId: user.wallet.walletNumber,
      },
      attributes: [
        "merchant",
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"], // <-- this is the key
        [sequelize.fn("count", sequelize.col("merchant")), "total_count"],
      ],
      group: ["merchant"],
      order: [[sequelize.literal("total_amount"), "DESC"]],
    });

    if (!transactions) {
      return res.status(400).send({
        status: false,
        message: "No transactions found",
      });
    }

    return res.status(200).send({
      status: true,
      data: transactions,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.getTotalAmountByMerchants = async (req, res, next) => {
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
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        walletId: user.wallet.walletNumber,

        merchants: req.params.merchants,
      },
      order: [["date", "DESC"]],
    });

    if (!transactions) {
      return res.status(400).send({
        status: false,
        message: "No transactions found",
      });
    }

    return res.status(200).send({
      status: true,
      data: transactions,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
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
      ],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.findAll({
      where: {
        walletId: user.wallet.walletNumber,
      },
      attributes: [
        "category",
        [sequelize.fn("sum", sequelize.col("amount")), "total_amount"], // <-- this is the key
      ],
      group: ["category"],
      order: [[sequelize.literal("total_amount"), "DESC"]],
    });

    if (!transactions) {
      return res.status(400).send({
        status: false,
        message: "No transactions found",
      });
    }

    return res.status(200).send({
      status: true,
      data: transactions,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
