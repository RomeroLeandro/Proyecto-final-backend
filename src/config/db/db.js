const mongoose = require("mongoose");
const env = require("../env/env");

const MONGODB_CONNECT = `mongodb+srv://${env.mongo.user}:${env.mongo.password}@cluster0.c9jlz11.mongodb.net/${env.mongo.name}?retryWrites=true&w=majority&ssl=true`;

mongoose.connect(MONGODB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
