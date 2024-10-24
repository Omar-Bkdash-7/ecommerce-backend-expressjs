const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");

const Coupon = require("../../models/coupon");

// Common validation rules
const couponNameValidation = async (val) => {
  const coupon = await Coupon.findOne({ name: val });
  if (coupon) {
    throw new Error("This coupon already exists, please choose another name.");
  }
};

const expireValidation = (val) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
  if (!regex.test(val)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD HH:MM:SS.");
  }
  const expirationDate = new Date(val);
  if (expirationDate < Date.now()) {
    throw new Error("Expiration date must be in the future.");
  }
   return true;
};

const discountValidation = (val) => {
  if (val < 0) {
    throw new Error("Discount value must be greater than 0.");
  }
  return true;
};

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required.")
    .custom(couponNameValidation),
  check("expire")
    .notEmpty()
    .withMessage("Expiration date is required.")
    .custom(expireValidation),
  check("discount")
    .notEmpty()
    .withMessage("Discount value is required.")
    .isNumeric()
    .withMessage("Discount must be a number.")
    .custom(discountValidation),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon ID format."),
  check("name").optional().custom(couponNameValidation),
  check("expire").optional().custom(expireValidation),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number.")
    .custom(discountValidation),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon ID format."),
  validatorMiddleware,
];

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon ID format."),
  validatorMiddleware,
];
