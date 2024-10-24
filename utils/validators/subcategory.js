const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Subcategory required")
    .isLength({ min: 2 })
    .withMessage("Too short subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("category").isMongoId().optional().withMessage("Invalid category id "),
  validatorMiddleware,
];

exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];
