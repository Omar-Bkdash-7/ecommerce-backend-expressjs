const express = require("express");
const AuthService = require("../services/auth");

const {
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
  createProductValidator,
} = require("../utils/validators/product");

const router = express.Router();

const {
  getProducts,
  postProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeProductImage,
} = require("../services/porduct");

router
  .route("/")
  .get(getProducts)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    createProductValidator,
    postProduct
  );

const review = require("./review");

//  product/<productId>/reviews
//  product/<productId>/reviews/<reviewId>
router.use("/:productId/reviews", review);

router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  )
  .get(getProductValidator, getProduct);

module.exports = router;
