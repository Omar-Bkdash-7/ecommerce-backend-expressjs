const Review = require("../models/review");
const factory = require("./handlers-factory");

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc Get list of review
// @route Get /api/review
// @access Public
exports.getReviews = factory.getAll(Review);

// @desc Get review by id
// @route GET /api/review/:id
// @access Public
exports.getReview = factory.getOne(Review);

exports.setProductAndUser = (req, res, next) => {
  // Nested route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

// @desc Create review
// @route POST /api/review
// @access Private/User
exports.postReview = factory.createOne(Review);

// @desc update review
// @route PUT /api/review/:id
// @access Private/User
exports.updateReview = factory.updateOne(Review);

// @desc delete review by id
// @route DELETE /api/review/:id
// @access Private/Admin-Manager-User
exports.deleteReview = factory.deleteOne(Review);
