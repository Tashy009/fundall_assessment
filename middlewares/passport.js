require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
const UserModel = require("../models").user;
const passport = require("passport");

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //extract bearer token from the header
opts.secretOrKey = process.env.JWT_SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    const user = await UserModel.findOne({
      where: {
        id: jwt_payload.id,
      },
    });
    // function (err, user) {
    /* if (err) {
      return done(err, false);
    } */
    if (user) {
      console.log(user);
      return done(null, user);
    } else {
      return done(null, false);
    }
  })
);
