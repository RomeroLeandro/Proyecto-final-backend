const userModel = require("../../models/user.model.mongo");
const CartService = require("../cart.service");
const cartService = new CartService();
const { createHash } = require("../../utils/password.hash");

class UserManager {
  constructor() {
    this.userModel = userModel;
  }

  async getUsers(params) {
    try {
      const users = await this.userModel.find(params || {});
      return users;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = this.userModel.findOne({ _id: id });
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByFilter(filter) {
    try {
      const user = this.userModel.findOne(filter);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async addToMyCart(userId, productId) {
    try {
      const user = await this.userModel.findOne({ _id: userId });
      const cart = await cartService.getCartById(user.cart);
      if (!cart) {
        throw new Error("Cart not found");
      } else {
        await cartService.addProductToCart(user.cart, productId);
      }
    } catch (error) {
      throw error;
    }
  }

  async createUser(data) {
    try {
      const newCart = await cartService.addCart();
      const newUser = await this.userModel.create({
        name: data.name,
        last_name: data.last_name,
        age: parseInt(data.age),
        email: data.email || null,
        password: data.password ? createHash(data.password) : undefined,
        cart: newCart._id,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(userId, password) {
    try {
      await this.userModel.updateOne({ _id: userId }, { password });
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(userId, newRole) {
    try {
      const user = this.userModel.updateOne({ _id: userId }, { role: newRole });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateLastConnection(user) {
    try {
      const userToUpdate = await this.userModel.findOne({
        _id: user._id || user._id,
      });
      if (!userToUpdate) throw new Error("User not found");
      await this.userModel.updateOne(
        { _id: user._id || user.userId },
        { last_connection: new Date() }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateUserDocument(userId, data) {
    try {
      const user = await this.getUserById(userId);
      const previousDocumentStatus =
        user.documents && user.documents.length > 0;
      const newDocumentStatus = await this.userModel.updateOne(
        { _id: userId },
        { documents: data }
      );
      if (previousDocumentStatus && newDocumentStatus) {
        await this.userModel.updateOne(
          { _id: userId },
          { documentUploadStatus: true }
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await this.getUserById(userId);
      await cartService.deleteCart(user.cart);
      await this.userModel.deleteOne({ _id: userId });
    } catch (error) {
      throw error;
    }
  }

  async deleteInactiveUsers(userDelete) {
    try {
      const usersIdDeleted = userDelete.map((user) => user._id);
      if (usersIdDeleted.length === 0) throw new Error("No users to delete");
      for (const userId of usersIdDeleted) {
        const user = await this.userModel.findOne({ _id: userId });
        if (user.cart) {
          await cartService.deleteCart(user.cart);
        }
      }
      const result = await this.userModel.deleteMany({
        _id: { $in: usersIdDeleted },
      });
      return result.deleteCount;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserManager;
