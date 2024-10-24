const mongoose = require("mongoose");
const Product = require("./product");

const reviewSchema = new mongoose.Schema(
  {
    title: { type: String },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is a 1.0"],
      max: [5, "Max ratings value is a 5.0"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    // parent reference one to many
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

// Mongoose query middleware
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

reviewSchema.statics.calcAverageRatingsAndQuentity = async function (
  productId
) {
  const result = await this.aggregate([
    // Stage 1 get all reviews on specific product
    {
      $match: { product: productId },
    },
    // Stage 2 grouping reviews based on productId and calcation average and quantity ratings
    {
      $group: {
        _id: "product",
        ratingsAverage: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingsAverage,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuentity(this.product);
});

//  To Delete rating form product when delete review
reviewSchema.pre("findOneAndDelete", async function (next) {
  this.r = await this.model.findOne(this.getFilter());
  next();
});

reviewSchema.post("findOneAndDelete", async function () {
  if (this.r)
    await this.r.constructor.calcAverageRatingsAndQuentity(this.r.product);
});

module.exports = mongoose.model("Review", reviewSchema);
