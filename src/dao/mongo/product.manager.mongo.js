const productModel = require("./models/product.model");
const productDto = require("../dto/product.dto");

class productManagerMongo {
  constructor() {
    this.productModel = productModel;
  }

  async getProducts(filters, query) {
    try {
      const products = await this.model.paginate(filters, query);
      const results = new productDto(products);
      return results;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const product = await this.model.findById(id);
      if (product) {
        return product.toObject();
      }
    } catch (error) {
      throw error;
    }
  }

  async getProductByCode(code) {
    try {
      const product = await this.model.findOne({ code: code });
      if (product) {
        return product.toObject();
      }
    } catch (error) {
      throw error;
    }
  }

  async addProduct(data) {
    let owner;

    try {
      if (data.userId === process.env.ADMIN_ID || data.userId) {
        owner = "admin";
      } else {
        owner = data.userId || data.uid;
      }
      const newProduct = new this.model.create({
        title: data.title,
        description: data.description,
        code: data.code,
        price: parceFloat(data.price),
        status: data.status,
        stock: data.stock,
        category: data.category,
        thumbnail: data.thumbnail || [],
        owner: owner,
      });
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, data) {
    try {
      const product = await this.model.getProductById(id);
      const updateProduct = {
        ...product,
        ...data,
      };
      updateProduct._id = product._id;
      await this.model.updateOne({ _id: id }, updateProduct);
      return updateProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await this.model.deleteOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = productManagerMongo;
