const CartRepository = require("../repositories/cart.repository");
const ProductRepository = require("../repositories/product.repository");
const productRepository = new ProductRepository();
const { transportMail } = require("../config/node.mailer");

class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
  }

  async getCarts() {
    try {
      return this.cartRepository.getCarts();
    } catch (error) {
      throw error;
    }
  }

  async getCartById(id) {
    try {
      return this.cartRepository.getCartById(id);
    } catch (error) {
      throw error;
    }
  }

  async addCart() {
    try {
      return this.cartRepository.addCart();
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cartId, productId, userId) {
    try {
      const cart = await this.cartRepository.getCartById(cartId);

      if (cart.length === 0) {
        throw new Error("Cart not found");
      }
      const product = await productRepository.getProductById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (userId === product.owner) {
        throw new Error("You can't add your own product to cart");
      }

      if (!userId || userId === "1") {
        throw new Error("You must be logged in to add products to cart");
      }

      return this.cartRepository.addProductToCart(cartId, productId);
    } catch (error) {
      throw error;
    }
  }

  async processCartProducts(data) {
    let amountTotal = 0;
    let productsOutStock = [];

    try {
      const cart = await this.cartRepository.getCartById(data);
      if (cart.length === 0) {
        throw new Error("Cart not found");
      }
      const productsToPurchase = cart[0].products;

      for (const productData of productsToPurchase) {
        const product = await productRepository.getProductById(
          productData.productId
        );
        if (!product) {
          throw new Error("Product not found");
        }

        if (product >= productData.quantity) {
          const productTotal = product.price * productData.quantity;
          amountTotal += productTotal;
          product.stock -= productData.quantity;
          await productRepository.updateProduct(product._id, {
            stock: product.stock,
          });
        } else {
          productsOutStock.push(product._id);
        }
      }
      if (productsOutStock.length === cart[0].products.length) {
        throw new Error("All products are out of stock");
      }

      const filteredProducts = cart[0].products.filter((productData) => {
        return !productsOutStock.some((id) =>
          id.equals(productData.product._id)
        );
      });

      return { filteredProducts, amountTotal, productsOutStock };
    } catch (error) {
      throw error;
    }
  }

  async finishedPurchase(data) {
    const user = data.user;
    const totalAmount = data.amount;
    let productsOutStock = data.productsOutStock;
    let productsIdOutStock;

    try {
      const order = {
        amount: totalAmount,
        purchaser: user.email || user.name,
        productsOutStock,
      };

      if (
        !productsOutStock &&
        productsOutStock.trim() !== "" &&
        productsOutStock.includes(",")
      ) {
        productsIdOutStock = productsOutStock.split(",");
      } else {
        productsIdOutStock = [productsOutStock];
      }
      await this.sendEmail(user.email, order);
      await this.cartRepository.updateCartProducts(
        user.cart,
        productsIdOutStock
      );
      return this.cartRepository.finishedPurchase(order);
    } catch (error) {
      throw error;
    }
  }

  async sendEmail(email, order) {
    try {
      const subject =
        order.productsOutStock.length === 0
          ? "Order completed"
          : "Order completed with products out of stock";
      const htmlContent =
        order.productosSinSuficienteStock.length === 0
          ? `<div>
               <h1>Thank you ${order.purchaser} for your purchase</h1>
               <p>Total Amount: ${order.amount}</p>
             </div>`
          : `<div>
               <h1>Thank you ${order.purchaser} for your purchase</h1>
               <p>Total Amount: ${order.amount}</p>
               <p>Some products could not be added due to insufficient stock. Other products have been added successfully</p>
               <p>Products without sufficient stock : ${order.productosSinSuficienteStock}</p>
             </div>`;

      await transportMail.sendMail({
        from: `Ecommerce <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        html: htmlContent,
        attachments: [],
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCartProducts(cartId, productsIdOutStock) {
    try {
      return this.cartRepository.updateCartProducts(cartId, productsIdOutStock);
    } catch (error) {
      throw error;
    }
  }

  async updateCartProduct(cartId, productId, quantity) {
    try {
      const cart = await this.cartRepository.getCartById(cartId);
      const product = await productRepository.getProductById(productId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      if (!product) {
        throw new Error("Product not found");
      }

      const existingProduct = cart[0].products.findIndex(
        (productData) => productData._id.toString() === productId
      );

      if (existingProduct === -1) {
        throw new Error("Product not found in cart");
      }

      return this.cartRepository.updateCartProduct(cartId, productId, quantity);
    } catch (error) {
      throw error;
    }
  }

  async deleteCartProduct(cartId, productId) {
    try {
      const cart = await this.cartRepository.getCartById(cartId);
      const product = await productRepository.getProductById(productId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      if (!product) {
        throw new Error("Product not found");
      }

      const existingProduct = cart[0].products.findIndex(
        (productData) => productData._id.toString() === productId
      );

      if (existingProduct === -1) {
        throw new Error("Product not found in cart");
      }

      return this.cartRepository.deleteCartProduct(cartId, productId);
    } catch (error) {
      throw error;
    }
  }

  async deleteCartProducts(cartId) {
    try {
      const cart = await this.cartRepository.getCartById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      if (cart[0].products.length === 0) {
        throw new Error("Cart is empty");
      }

      return this.cartRepository.deleteCartProducts(cartId);
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id) {
    try {
      const cart = await this.cartRepository.getCartById(id);
      if (!cart) {
        throw new Error("Cart not found");
      }

      return this.cartRepository.deleteCart(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;
