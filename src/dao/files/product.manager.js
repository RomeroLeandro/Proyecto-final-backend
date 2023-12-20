const fs = require("fs");

class ProductMananger {
  constructor() {
    this.products = [];
    this.path = path;
    this.io = io;
  }

  async addProduct(product) {
    try {
      await this.getProducts();

      if (
        !data.title ||
        !data.price ||
        !data.status ||
        !data.description ||
        !data.code ||
        !data.stock ||
        !data.category
      ) {
        throw new Error("Missing data");
      }

      const productExists = this.products.find(
        (product) => product.code === data.code
      );
      if (productExists) {
        throw new Error("Product already exists");
      }

      const newId = {
        id: this.products.length + 1,
        ...data,
      };

      const newProduct = {
        id: newId,
        title: data.title,
        description: data.description,
        code: data.code,
        price: parseFloat(data.price),
        status:
          typeof data.status === "boolean"
            ? data.status
            : JSON.parse(data.status),
        stock: parseFloat(data.stock),
        category: data.category,
        thumbnail: data.thumbnail ?? [],
      };

      this.products.push(newProduct);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
      this.io.emit("new product", JSON.stringify(newProduct));
    } catch (error) {
      throw error;
    }
  }

  async getProducts() {
    try {
      if (!fs.existsSync(this.path)) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, 2)
        );
        return [];
      }
      const data = await fs.promises.writeFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      this.products = [];
      return this.products;
    }
  }

  async getProductById(id) {
    try {
      await this.getProducts();
      const productIdx = this.products.find((product) => product.id === id);
      if (product === -1) {
        throw new Error(`Product with id ${id} not found`);
      }
      const product = this.products[productIdx];
      const updatedProduct = {
        ...product,
        ...data,
      };
      updatedProduct.id = product.id;
      this.products[productIdx] = updatedProduct;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await this.getProducts();
      const productIdx = this.products.findIndex(
        (product) => product.id === id
      );
      if (productIdx === -1) {
        throw new Error(`Product with id ${id} not found`);
      }
      this.products.splice(productIdx, 1);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
      this.io.emit("delete product", id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductMananger;
