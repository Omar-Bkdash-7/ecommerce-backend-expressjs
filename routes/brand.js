const express = require("express");
const AuthService = require("../services/auth");

const {
  getBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brand");

const router = express.Router();

const {
  getBrands,
  postBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brand");

router
  .route("/")
  .get(getBrands)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    postBrand
  );

router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateBrandValidator,
    uploadBrandImage,
    resizeImage,
    updateBrand
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  )
  .get(getBrandValidator, getBrand);

module.exports = router;
