const express = require("express");
const AuthService = require("../services/auth");

// const {

//   createBrandValidator,
// } = require("../utils/validators/brand");

const router = express.Router();

const {
  addToCart,
  getCart,
  removeProductFromCart,
  removeAllProductsFromCart,
  clearCart,
  applyCouponOnCart,
} = require("../services/cart");

router.use(AuthService.protect, AuthService.allowedTo("user"));

router
  .route("/")
  .get(getCart)
  .post(addToCart)
  .put(removeAllProductsFromCart)
  .delete(clearCart);

router.route("/:productId").delete(removeProductFromCart);
router.route("/coupon").put(applyCouponOnCart);

module.exports = router;
