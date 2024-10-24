const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const ApiError = require("../utils/api-error");

// @desc Add new address to user addresses
// @route POST /api/addresses
// @access Private/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({ status: "Success", addresses: user.addresses });
});

// @desc Remove address from list addresses
// @route DELETE /api/addresses/:addressId
// @access Protect/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    addresses: user.addresses,
  });
});

// @desc Get list of address
// @route GET /api/addresses
// @access Protect/user
exports.getAllAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  if (!user) return next(new ApiError("User not found.", 404));
  res.status(200).json({
    status: "Success",
    count: user.addresses.length,
    products: user.addresses,
  });
});
