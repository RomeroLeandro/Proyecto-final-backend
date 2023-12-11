const express = require("express");
const passport = require("passport");
const sessionRouter = express.Router();

sessionRouter.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate("login", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Unauthorized" });
    }

    // Genera el token y establece la cookie en la respuesta
    const token = user.token; // Asegúrate de que el token esté disponible en user

    res.cookie("token", token, {
      httpOnly: true,
      // Otras opciones de configuración de la cookie aquí
    });

    // Envía la respuesta al cliente
    return res.json({ user: user.user, token: user.token });
  })(req, res, next);
});


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
