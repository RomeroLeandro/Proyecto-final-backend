const mongoose = require("mongoose");

class MongoDatabase {
  static instance;
  static CONNECT_MONGO_DB;
  constructor(settings) {
    MongoDatabase.CONNECT_MONGO_DB = `mongodb+srv://${setting.mongoUser}:${settings.mongoPassword}@${settings.mongoHost}/${settings.mongoName}?retryWrites=true&w=majority`;
    mongoose.connect(MongoDatabase.CONNECT_MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  static getInstance(settings) {
    if (this.instance) {
      console.log("instance exists");
      return this.instance;
    }
    this.instance = new MongoDatabase(settings);
    console.log(
      `new instance created, connection to database in ${settings.mongoName}`
    );
    return this.instance;
  }
}

module.exports = MongoDatabase;
