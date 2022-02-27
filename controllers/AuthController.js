const User = require("../models").user;
const Wallet = require("../models").wallet;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { signupSchema, loginSchema } = require("../helpers/schema");
const { generateCode } = require("../helpers/generatecode");

const { Op } = require("sequelize");

exports.signup = async (req, res, next) => {
  try {
    const result = await signupSchema.validateAsync(req.body);

    if (result.error) {
      return res.status(422).send({
        status: false,
        message: result.error.details[0].message,
      });
    }

    const { firstName, lastName, email, phonenumber, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email"],
    });

    if (user) {
      return res.status(400).send({
        status: false,
        message: "This email already exists",
      });
    }
    const hashPwd = bcrypt.hashSync(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phonenumber,
      password: hashPwd,
    });

    if (!newUser) {
      return res.status(400).send({
        status: false,
        message: "Something went wrong",
      });
    }

    let walletNumber = generateCode();
    let checkWallet = await Wallet.findOne({
      where: {
        walletNumber,
      },
    });
    while (checkWallet) {
      walletNumber = generateCode();

      checkWallet = await Wallet.findOne({
        where: {
          walletNumber,
        },
      });
    }

    walletDetails = {
      walletNumber,
      userId: newUser.id,
    };

    const wallet = await Wallet.create(walletDetails);

    return res.status(201).send({
      status: true,
      message: "Registration successfully, sign in to continue",
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await loginSchema.validateAsync(req.body);

    if (result.error) {
      return res.status(422).send({
        status: false,
        message: result.error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "email", "password"],
    });

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "User not found",
      });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        status: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).send({
      status: true,
      message: "Login successfully",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};
