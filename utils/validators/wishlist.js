const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");
const Product = require("../../models/product");

exports.createWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom(async (val) => {
      const product = await Product.findById(val);
      if (!product) return Promise.reject(new Error("This product not exist."));
    }),
  validatorMiddleware,
];

exports.deleteWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];
