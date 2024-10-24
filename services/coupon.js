const Coupon = require("../models/coupon");
const factory = require("./handlers-factory");

// @desc Get list of coupons
// @route Get /api/coupons
// @access Private/Admin-Manager
exports.getCoupons = factory.getAll(Coupon);

// @desc Get coupon by id
// @route GET /api/coupons/:id
// @access Private/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);

// @desc Create coupon
// @route POST /api/coupons
// @access Private/Admin-Manager
exports.postCoupon = factory.createOne(Coupon);

// @desc update coupon
// @route PUT /api/coupons/:id
// @access Private/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc delete coupon by id
// @route DELETE /api/coupons/:id
// @access Private/Admin-Manager
exports.deleteCoupon = factory.deleteOne(Coupon);
