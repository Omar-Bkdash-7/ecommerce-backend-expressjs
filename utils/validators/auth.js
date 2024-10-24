const slugify = require("slugify");
const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");
const User = require("../../models/user");

exports.sginupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 50 })
    .withMessage("Too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Can't be Empty")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use."));
        }
      });
    }),

  check("password")
    .notEmpty()
    .withMessage("Password Can't be Empty")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters.")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword)
        throw new Error("Password and confirm password not match.");
      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password can't be empty"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG", "ar-SY"])
    .withMessage("Invalid , Phone must be only SY SA or EG ."),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Can't be Empty")
    .isEmail()
    .withMessage("Invalid email format"),

  check("password")
    .notEmpty()
    .withMessage("Password Can't be Empty")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters."),

  validatorMiddleware,
];

exports.forgetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Can't be Empty")
    .isEmail()
    .withMessage("Invalid email format"),

  validatorMiddleware,
];

exports.resetPasswordvalidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Can't be Empty")
    .isEmail()
    .withMessage("Invalid email format"),

  check("password")
    .notEmpty()
    .withMessage("Password Can't be Empty")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters.")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword)
        throw new Error("Password and confirm password not match.");
      return true;
    }),
];
