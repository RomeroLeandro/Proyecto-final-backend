const { getCartsDao } = require("../factories/cart.dao.factory");

class CartRepository {
  constructor() {
    this.dao = getCartsDao(process.env.STORAGE);
  }

  async getCarts() {
    return this.dao.getCarts();
  }

  async getCartById(id) {
    return this.dao.getCartById(id);
  }

  async addCart() {
    return this.dao.addCart();
  }

  async addProductToCart(cartId, productId, userId) {
    return this.dao.addProductToCart(cartId, productId, userId);
  }

  async finishPurchase(data) {
    return this.dao.finishPurchase(data);
  }

  async updateCartProducts(cartId, productsOutStock) {
    return this.dao.updateCartProducts(cartId, productsOutStock);
  }

  async updateCartProduct(cartId, productId, quantity) {
    return this.dao.updateCartProduct(cartId, productId, quantity);
  }

  async deleteCartProduct(cartId, productId) {
    return this.dao.deleteCartProduct(cartId, productId);
  }

  async deleteCartProducts(cartId) {
    return this.dao.deleteCartProducts(cartId);
  }

  async deleteCart(cartId) {
    return this.dao.deleteCart(cartId);
  }
}

module.exports = CartRepository;
