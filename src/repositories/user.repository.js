const { getUsersDao } = require("../factories/user.dao.factory");
const UserDto = require("../dao/dto/users.dto");

class userRepository {
  constructor() {
    this.userDao = getUsersDao(process.env.STORAGE);
  }

  async getUsers(params) {
    const users = await this.userDao.getUsers(params);
    if (user.length === 0) throw new Error("Users not found");
    const usersDto = new UserDto(users);

    return usersDto.users;
  }

  async getUserById(id) {
    return this.userDao.getUserById(id);
  }

  async getUserByFilter(filter) {
    return this.userDao.getUserByFilter(filter);
  }

  async addToMyCart(userId, productId) {
    return this.userDao.addToMyCart(userId, productId);
  }

  async createUser(data) {
    return this.userDao.createUser(data);
  }

  async resetPassword(userId, password) {
    return this.userDao.resetPassword(userId, password);
  }

  async updateUserRole(userId, newRole) {
    return this.userDao.updateUserRole(userId, newRole);
  }

  async updateUserLastConnection(user) {
    return this.userDao.updateUserLastConnection(user);
  }

  async deleteUser(userId) {
    return this.userDao.deleteUser(userId);
  }

  async deleteInactiveUsers(usersToDelete) {
    return this.userDao.deleteInactiveUsers(usersToDelete);
  }
}

module.exports = userRepository;
