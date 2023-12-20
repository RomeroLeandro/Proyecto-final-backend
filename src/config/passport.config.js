const passport = require("passport");
const loginLocalStrategy = require("./login.local.strategy");
const githubStrategy = require("./github.strategy");
const registerLocalStrategy = require("./register.local.strategy");
const { jwtStrategy } = require("./jwt.strategy");

const initializePassport = () => {
  passport.use("login", loginLocalStrategy);
  passport.use("register", registerLocalStrategy);
  passport.use("github", githubStrategy);
  passport.use("jwt", jwtStrategy);
};

module.exports = initializePassport;
