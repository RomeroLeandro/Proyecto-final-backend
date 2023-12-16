const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  admin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["admin", "premium", "user"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cart",
  },
  resetPasswordToken: String,
  resetPasswordTokenExp: Date,
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
  next();
});

module.exports = mongoose.model("users", userSchema);
