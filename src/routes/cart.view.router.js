const express = require("express");
const cartViewRouter = express.Router();
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart.model");
const env = require("../config/env/env");

cartViewRouter.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/login");
    }
    const decoded = jwt.verify(token, env.session.secret);
    const { userId } = decoded;

    const cart = await Cart.findOne({ user: userId })
      .populate("products.productId")
      .lean();

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
