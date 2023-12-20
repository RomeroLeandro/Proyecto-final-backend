const { set } = require("mongoose");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productsSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true, set: (value) => Math.round(value) },
  category: { type: String, required: true },
  thumbnail: { type: String },
  owner: { type: String, default: "admin" },
});

productsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("products", productsSchema);