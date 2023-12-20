const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ["admin", "premium", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  createdAt: { type: Date, default: Date.now },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    default: [],
  },
  documentUpload: {
    type: String,
    default: false,
  },
  last_connection: {
    type: Date,
  },
});

module.exports = mongoose.model("users", userSchema);
