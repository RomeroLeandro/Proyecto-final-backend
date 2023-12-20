const { getProductsDao } = require("../factories/product.dao.factory");

class ProductRepository {
  constructor() {
    this.dao = getProductsDao(process.env.STORAGE);
  }

  async getProducts(filters, query) {
    return this.dao.getProducts(filters, query);
  }

  async getProductById(id) {
    return this.dao.getProductById(id);
  }

  async getProductByCode(code) {
    return this.dao.getProductByCode(code);
  }

  async addProduct(data) {
    return this.dao.addProduct(data);
  }

  async updateProduct(id, data) {
    return this.dao.updateProduct(id, data);
  }

  async deleteProduct(id) {
    return this.dao.deleteProduct(id);
  }
}

module.exports = ProductRepository;
