const cartService = require("../services/cart.service");

const getAllCarts = async (req, res) => {
  try {
    const carts = await cartService.getAllCarts();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await cartService.getCartById(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCart = async (req, res) => {
  try {
    const cart = await cartService.createCart(req.body);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await cartService.updateCart(req.params.id, req.body);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await cartService.deleteCart(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addProductToCart = async (req, res) => {
  const isFromView = req.body.isFromView;
  try {
    const { id, pid } = req.params;
    const { quantity } = req.body;
    console.log("Product ID:", pid); // Verificar el ID del producto
    console.log("Cart ID:", id);
    if (!id || !pid) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const result = await cartService.addProductToCart(
      id,
      pid,
      Number(quantity) || 1
    );

    if (isFromView) {
      res.json(result);
    }
    res.redirect(`/carts/${id}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
};
