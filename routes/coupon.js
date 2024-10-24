const express = require("express");
const AuthService = require("../services/auth");

const {
  getCouponValidator,
  deleteCouponValidator,
  updateCouponValidator,
  createCouponValidator,
} = require("../utils/validators/coupon");

const router = express.Router();

const {
  getCoupons,
  postCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/coupon");

router.use(AuthService.protect, AuthService.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCouponValidator, postCoupon);

router
  .route("/:id")
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon)
  .get(getCouponValidator, getCoupon);

module.exports = router;
