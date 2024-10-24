const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItmes: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Producat is required"],
        },
        price: Number,
        color: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
