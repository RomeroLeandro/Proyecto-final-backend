const productDaoMongo = require("../dao/mongo/product.manager.mongo");

const mapperStorage = {
  mongo: new productDaoMongo(),
  default: new productDaoMongo(),
};

const getProductsDao = (storage) => {
  const storageFn = mapperStorage[storage] || mapperStorage.default;

  const dao = storageFn();

  return dao;
};

module.exports = { getProductsDao };
