const mongoose = require("mongoose");

const ticketSchema = mongoose.Schema({
  code: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});

module.exports = mongoose.model("tickets", ticketSchema);
