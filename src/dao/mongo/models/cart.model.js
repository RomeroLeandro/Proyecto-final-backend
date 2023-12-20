const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("cart", cartSchema);
