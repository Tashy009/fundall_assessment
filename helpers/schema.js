const joi = require("joi");

exports.signupSchema = joi.object().keys({
  firstName: joi
    .string()
    .regex(/^[a-zA-Z]*$/)
    .required()
    .trim()
    .lowercase()
    .error(new Error("First Name is required")),
  lastName: joi
    .string()
    .regex(/^[a-zA-Z\\-]*$/)
    .required()
    .trim()
    .lowercase()
    .error(new Error("Last Name is required")),
  email: joi
    .string()
    .email()
    .required()
    .trim()
    .lowercase()
    .error(new Error("A valid email address is required")),
  phonenumber: joi
    .string()
    .regex(/^[0-9]*$/)
    .required()
    .trim()
    .lowercase()
    .error(new Error("Phone number is required")),
  password: joi.string().required().error(new Error("Password is required")),
});

exports.loginSchema = joi.object().keys({
  email: joi
    .string()
    .regex(/\S+@\S+\.\S+/)
    .required()
    .trim()
    .lowercase()
    .error(new Error("A valid email address is required")),
  password: joi.string().required().error(new Error("Password is required")),
});

exports.fundWalletSchema = joi.object().keys({
  amount: joi.number().required().error(new Error("Amount is required")),
});

exports.performTransactionSchema = joi.object().keys({
  amount: joi.number().required().error(new Error("Amount is required")),
  title: joi
    .string()
    .required()
    .error(new Error("Transaction Title is required")),
  merchant: joi.string().optional(),

  category: joi.string().optional(),

  description: joi.string().optional(),
});

exports.cardSchema = joi.object().keys({
  type: joi
    .string()
    .valid("lifestyle pro", "lifestyle premium", "lifestyle business")
    .required()
    .error(new Error("Type is required")),
});
