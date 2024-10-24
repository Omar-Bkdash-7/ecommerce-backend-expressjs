const express = require("express");
const AuthService = require("../services/auth");

const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/category");

const router = express.Router();

const {
  getCategories,
  postCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/category");

const subcategory = require("./subcategory");

router.use("/:categoryId/subcategory", subcategory);

router
  .route("/")
  .get(getCategories)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    postCategory
  );

router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  )
  .get(getCategoryValidator, getCategory);

module.exports = router;
