const express = require("express");
const sessionViewRouter = express.Router();
const verifyAccessToken = require("../middleware/token.cookie");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const env = require("../config/env/env");

sessionViewRouter.get("/login", (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect("/products");
  }
  res.render("login");
});

sessionViewRouter.get("/register", (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect("/products");
  }
  res.render("register");
});

sessionViewRouter.get("/reset-password", (req, res, next) => {
  res.render("reset-password");
});

sessionViewRouter.get("/reset-password/:resetToken", async (req, res, next) => {
  const { resetToken } = req.params;

  try {
    const { userId } = jwt.verify(resetToken, env.session.secret);
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: resetToken,
      resetPasswordTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Si el token es válido y no ha expirado, muestra la página para restablecer la contraseña
    return res.render("reset-password-form", { resetToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = sessionViewRouter;
