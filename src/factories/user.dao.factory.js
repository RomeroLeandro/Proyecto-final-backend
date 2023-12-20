const userDaoMongo = require("../dao/mongo/user.manager.mongo");

const mapperStorage = {
  mongo: new userDaoMongo(),
  default: new userDaoMongo(),
};

const getUsersDao = (storage) => {
  const storageFn = mapperStorage[storage] || mapperStorage.default;

  const dao = storageFn();

  return dao;
};

module.exports = { getUsersDao };
