const User = require("../models").user;
const Wallet = require("../models").wallet;
const Transaction = require("../models").transaction;
const { fundWalletSchema } = require("../helpers/schema");

exports.getUserWallet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
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

    return res.status(200).send({
      status: true,
      data: user.wallet,
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.fundWallet = async (req, res, next) => {
  try {
    const result = await fundWalletSchema.validateAsync(req.body);
    const userId = req.user.id;
    const { amount } = req.body;
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

    const wallet = user.wallet;
    const newBalance = wallet.balance + amount; // add the amount to the balance
    const updatedWallet = await Wallet.update(
      {
        balance: newBalance,
      },
      {
        where: {
          id: wallet.id,
        },
      }
    );

    if (!updatedWallet) {
      return res.status(400).send({
        status: false,
        message: "Wallet not found",
      });
    }

    const transaction = await Transaction.create({
      userId,
      walletId: wallet.walletNumber,
      amount,
      title: "Fund Wallet",
      type: "credit",
      date: new Date(),
    });

    if (!transaction) {
      return res.status(400).send({
        status: false,
        message: "Transaction not created",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Funded successfully",
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
