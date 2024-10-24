const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");
const Review = require("../../models/review");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Ratings required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((val, { req }) =>
      Review.findOne({ user: req.user._id, product: val }).then((review) => {
        if (review)
          return Promise.reject(
            new Error("You already created a review before")
          );
      })
    ),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom((val, { req }) =>
      Review.findById(val).then((review) => {
        if (!review)
          return Promise.reject(
            new Error(`There is no review with id value ${val}`)
          );

        if (review.user._id.toString() !== req.user._id.toString())
          return Promise.reject(
            new Error("You are not allowed to update this action.")
          );
      })
    ),
  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 to 5"),
    
  check("product")
    .notEmpty()
    .withMessage("Product is requrired")
    .isMongoId()
    .withMessage("Invalid review id format"),

  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id format")
    .custom((val, { req }) => {
      if (req.user.roles === "user") {
        return Review.findById(val).then((review) => {
          if (!review)
            return Promise.reject(
              new Error(`There is no review with id value ${val}`)
            );
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to delete this action.")
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
