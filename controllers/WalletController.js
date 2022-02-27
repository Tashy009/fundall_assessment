const User = require("../models").user;
const Wallet = require("../models").wallet;

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
