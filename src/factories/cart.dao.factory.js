const cartDaoMongo = require("../dao/mongo/cart.manager.mongo");

const mapperStorage = {
  mongo: new cartDaoMongo(),
  default: new cartDaoMongo(),
};

const getCartsDao = (storage) => {
  const storageFn = mapperStorage[storage] || mapperStorage.default;

  const dao = storageFn;

  return dao;
};

module.exports = { getCartsDao };
