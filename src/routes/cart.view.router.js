const express = require("express");
const cartViewRouter = express.Router();
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const authMiddleware = require("../middleware/token.cookie");
const env = require("../config/env/env");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

cartViewRouter.get("/:id", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      console.log("Token no proporcionado.");
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token no proporcionado." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.session.secret);
    } catch (error) {
      console.log("Error al verificar el token:", error);
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token inválido." });
    }

    const userId = decoded.user._id;

    console.log("UserID:", userId);

    // Buscar al usuario por su ID y obtener su propiedad 'cart' (carrito)
    const user = await User.findById(userId);
    console.log("Usuario encontrado:", user);

    if (!user || !user.cart) {
      console.log("Carrito no encontrado para este usuario.");
      return res
        .status(404)
        .json({ message: "Carrito no encontrado para este usuario." });
    }

    // Obtener el carrito del usuario
    const cart = await Cart.findById(user.cart);
    console.log("Carrito encontrado:", cart);

    if (!cart || !cart.products || cart.products.length === 0) {
      console.log("El carrito está vacío para este usuario.");
      return res
        .status(404)
        .json({ message: "Carrito vacío para este usuario." });
    }

    // Obtener los IDs de los productos del carrito
    const productIds = cart.products.map((product) => product._id);
    console.log("IDs de productos en el carrito:", productIds);

    // Buscar los detalles de los productos usando los IDs obtenidos del carrito
    const products = await Product.find({ _id: { $in: productIds } });
    console.log("Detalles de productos en el carrito:", products);

    // Renderizar la vista 'cart' con los detalles de los productos del carrito del usuario
    res.render("cart", { products });
  } catch (error) {
    console.log("Error al obtener el carrito:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el carrito.", error: error.message });
  }
});

module.exports = cartViewRouter;
