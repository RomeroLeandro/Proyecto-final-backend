const jwt = require("jsonwebtoken");
const env = require("../config/env/env");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token no proporcionado." });
    }

    const decoded = jwt.verify(token, env.session.secret);

    console.log("Decoded token:", decoded); // Verificar el contenido del token decodificado

    // Verificar si el token contiene la información del usuario
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Token inválido o incompleto." });
    }

    // Obtener al usuario desde la base de datos utilizando el ID del token
    const user = await User.findById(decoded.userId);

    console.log("User found:", user); // Verificar el usuario obtenido

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Establecer el usuario en el objeto de solicitud para su uso posterior
    req.user = user;

    // Llamar a next() para pasar al siguiente middleware o ruta
    next();
  } catch (error) {
    console.log("Error al verificar el token:", error); // Verificar el error en la verificación del token
    return res
      .status(401)
      .json({ message: "Acceso denegado. Error al verificar el token." });
  }
};

module.exports = authMiddleware;
