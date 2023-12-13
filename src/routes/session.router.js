const express = require("express");
const passport = require("passport");
const sessionRouter = express.Router();
const jwt = require("jsonwebtoken");
const env = require("../config/env/env");
const User = require("../models/user.model");
const userController = require("../controllers/user.controller");
const githubController = require("../controllers/github.controller");

sessionRouter.post("/login", userController.login);
sessionRouter.post("/register", userController.register);
sessionRouter.get("/github", githubController);

sessionRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/session/login");
});

sessionRouter.get(
  "/github-callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    try {
      // Obtén los datos del usuario desde req.user después de la autenticación exitosa con GitHub
      console.log(req.user);
      const { newUser } = req.user;

      // Crea un token JWT con los datos del usuario
      const token = jwt.sign({ newUser }, env.session.secret, {
        expiresIn: "1h", // Define la expiración del token según tus necesidades
      });

      // Establece una cookie en la respuesta con el token generado
      res.cookie("token", token, {
        httpOnly: true,
        // Otras opciones de configuración de la cookie aquí (como secure: true para HTTPS)
      });

      // Redirige a la página deseada después de la autenticación exitosa
      res.redirect('/products'); // Cambia '/dashboard' por la ruta a la que quieras redirigir

    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: error.message });
    }
  }
);

// sessionRouter.post("/login", (req, res, next) => {
//   passport.authenticate("login", { session: false }, (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ message: "Internal Server Error" });
//     }
//     if (!user) {
//       return res.status(401).json({ message: info.message || "Unauthorized" });
//     }
//     const token = user.token;

//     res.cookie("token", token, {
//       httpOnly: true,
//     });

//     return res.json({ user: user.user, token: user.token });
//   })(req, res, next);
// });


// sessionRouter.post(
//   "/register",
//   passport.authenticate("register", { session: false }),
//   (req, res) => {
//     res.json({ user: req.user.newUser, token: req.user.token });
//   }
// );

// sessionRouter.get(
//   "/github",
//   passport.authenticate("github", { session: false })
// );

sessionRouter.get(
  "/github-callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    res.json({ user: req.user.newUser, token: req.user.token });
  }
);

sessionRouter.get('/current', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'No token' });
    }

    const decodedToken = jwt.verify(token, env.session.secret);
    const userId = decodedToken.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'No user' });
    }

    const userDataJSON = user.toObject();

    return res.status(200).json({ user: userDataJSON });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = sessionRouter;
