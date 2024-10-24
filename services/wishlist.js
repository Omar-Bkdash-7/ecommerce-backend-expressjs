const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const ApiError = require("../utils/api-error");

// @desc Add product to wishlist
// @route POST /api/wishlist
// @access Protect/user
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Prodect added successfully to wishlist.",
    products: user.wishlist,
  });
});

// @desc Remove product from wishlist
// @route DELETE /api/wishlist/:productId
// @access Protect/user
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Prodect removed successfully form wishlist.",
    products: user.wishlist,
  });
});

// @desc Get all product from wishlist
// @route GET /api/wishlist
// @access Protect/user
exports.getAllProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) return next(new ApiError("User not found.", 404));
  res.status(200).json({
    status: "Success",
    count: user.wishlist.length,
    products: user.wishlist,
  });
});
