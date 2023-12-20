const fs = require("fs");

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
  }

  async addCart() {
    try {
      await this.getCarts();
      const newCart = {
        id: this.carts.length + 1,
        products: [],
      };

      this.carts.push(newCart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      throw error;
    }
  }

  async getCarts() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.carts, null, 2)
        );
        return [];
      }

      const data = await fs.promises.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
      return this.carts;
    } catch (error) {
      this.carts = [];
      throw error;
    }
  }

  async getCartById(id) {
    try {
      await this.getCarts();
      const cart = this.carts.find((cart) => cart.id === id);
      if (!cart) {
        throw new Error(`Cart with id ${id} not found`);
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async cartsLoad() {
    try {
      const dataProducts = await fs.promises.readFile(
        "./src/data/products.json",
        "utf-8"
      );
      const products = JSON.parse(dataProducts);
      return products;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(id, product) {
    try {
      const cart = await this.getCartById(id);
      const products = await this.productsLoad();
      const productFound = products.find((prod) => prod.id === product.id);
      if (!productFound) {
        throw new Error(`Product with id ${product.id} not found`);
      }

      const productAdd = {
        product: productFound.id,
        quantity: 1,
      };

      const productInCart = cart.products.find(
        (prod) => prod.product === productFound.id
      );

      productInCart !== -1
        ? cart.products[productInCart].quantity++
        : cart.products.push(productAdd);

      cart.products.sort((a, b) => a.product - b.product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartManager;
