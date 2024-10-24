const express = require("express");
const AuthService = require("../services/auth");

const {
  createWishlistValidator,
  deleteWishlistValidator,
} = require("../utils/validators/wishlist");

// Nested route
const router = express.Router({ mergeParams: true });

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getAllProductFromWishlist,
} = require("../services/wishlist");

router.use(AuthService.protect, AuthService.allowedTo("user"));

router.post(
  "/",
  createWishlistValidator,
  addProductToWishlist
);

router.delete(
  "/:productId",
  deleteWishlistValidator,
  removeProductFromWishlist
);

router.get("/", getAllProductFromWishlist);

module.exports = router;
