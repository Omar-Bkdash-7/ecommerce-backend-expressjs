const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name is required"],
      unique: [true, "Coupon name must be unique"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
