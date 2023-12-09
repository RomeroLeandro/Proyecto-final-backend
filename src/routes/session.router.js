const express = require("express");
const passport = require("passport");
const sessionRouter = express.Router();

sessionRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    res.json({ user: req.user, token: req.user.token });
  }
);

sessionRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  (req, res) => {
    res.json({ user: req.user.newUser, token: req.user.token });
  }
);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { session: false })
);

sessionRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.json({ user: req.user.newUser, token: req.user.token });
  }
);

module.exports = sessionRouter;