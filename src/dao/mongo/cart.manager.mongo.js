const cartModel = require("./models/cart.model");
const TicketManagerMongo = require("./ticket.manager.mongo");
const ticketManager = new TicketManagerMongo();

class CartManagerMongo {
  constructor() {
    this.model = cartModel;
  }

  async getCarts() {
    try {
      const carts = await this.model.find();
      return carts.map((cart) => cart.toObject());
    } catch (error) {
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.model.findOne({ _id: id });
      if (!cart) {
        throw new Error(`Cart ${id} not found`);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addCart() {
    try {
      const newCart = await this.model.create({});
      return newCart;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await this.model.findById(cartId);
      const existingProduct = cart.products.findIndex(
        (product) => product.product._id === productId
      );

      existingProduct !== -1
        ? cart.products[existingProduct].quantity++
        : cart.products.push({ product: productId, quantity: 1 });
      await cart.save();
    } catch (error) {
      throw error;
    }
  }

  async finishPurchase(data) {
    try {
      const newOrder = await ticketManager.createTicket({
        amount: data.amount,
        purchaser: data.purchaser,
      });
      return {
        purchaser: newOrder.purchaser,
        amount: newOrder.amount,
        productsOutStock: data.productsOutStock,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateCartProducts(cartId, productsOutStock) {
    const cart = await this.model.findById(cartId);
    if (!cart) {
      throw new Error(`Cart ${cartId} not found`);
    }
    try {
      const currentProducts = cart.products;

      const filteredProducts = currentProducts.filter((product) =>
        productsOutStock.includes(product.product._id.toString())
      );
      await this.model.updateOne(
        { _id: cartId },
        { products: filteredProducts }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCartProduct(cartId, productId, quantity) {
    try {
      await this.model.updateOne(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteCartProduct(cartId, productId) {
    try {
      await this.model.updateOne(
        { _id: cartId },
        { $pull: { products: { product: productId } } }
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteCartProducts(cartId) {
    try {
      await this.model.updateOne({ _id: cartId }, { $set: { products: [] } });
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      await this.getCartById(cartId);
      await this.model.deleteOne({ _id: cartId });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManagerMongo;
