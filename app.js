const express = require("express");
require("dotenv").config();

const app = express();
const Cors = require("cors");
const logger = require("morgan");
const BodyParser = require("body-parser");

const sequelize = require("./database/db");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Routes = require("./routes");

app.use(Cors());
app.use(logger("dev"));
app.use(BodyParser.json());

app.use(
  BodyParser.urlencoded({
    extended: false,
  })
);

//passport
app.use(passport.initialize());

require("./middlewares/passport");

//routes
app.get("/", (req, res) => {
  return res.send("Welcome to Fundall Ewallet Api");
});

app.use("/api", Routes);

// Handles all errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Not found route
app.use((req, res, next) => {
  return res.status(404).send({ status: false, message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));
