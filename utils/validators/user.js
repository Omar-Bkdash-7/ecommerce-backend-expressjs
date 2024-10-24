const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");
const User = require("../../models/user");

exports.createUserValidator = [
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

  check("profileImage").optional(),

  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("email").optional(),
  body("password").optional(),
  body("role").optional(),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.confirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.updateLoggedPasswordValidator = [
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

  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 50 })
    .withMessage("Too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      await User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use."));
        }
      });
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG", "ar-SY"])
    .withMessage("Invalid , Phone must be only SY SA or EG ."),

  validatorMiddleware,
];
