const express = require("express");
const AuthService = require("../services/auth");

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/review");

// Nested route
const router = express.Router({ mergeParams: true });

const {
  getReviews,
  postReview,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductAndUser,
} = require("../services/review");

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    AuthService.protect,
    AuthService.allowedTo("user"),
    setProductAndUser,
    createReviewValidator,
    postReview
  );

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    AuthService.protect,
    AuthService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    AuthService.protect,
    AuthService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
