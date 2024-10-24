const express = require("express");
const AuthService = require("../services/auth");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validators/subcategory");
// Nested route
// mergeParams : Allow us to access params on other routes
const router = express.Router({ mergeParams: true });

const {
  getSubCategories,
  postSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setSubCategory,
  createFilterObj,
} = require("../services/subcategory");

router
  .route("/")
  .get(createFilterObj, getSubCategories)
  .post(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    setSubCategory,
    createSubCategoryValidator,
    postSubCategory
  );

router
  .route("/:id")
  .put(
    AuthService.protect,
    AuthService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("admin"),
    deletesubCategoryValidator,
    deleteSubCategory
  )
  .get(getSubCategoryValidator, getSubCategory);

module.exports = router;
