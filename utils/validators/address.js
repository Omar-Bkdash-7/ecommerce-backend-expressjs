const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validation");
const User = require("../../models/user");

exports.createAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("Token is expired, please login again.");
      }
      const aliasExists = user.addresses.some((address) => address.alias === val);
      if (aliasExists) {
        throw new Error("This alias already exists, please choose another alias.");
      }
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG", "ar-SY"])
    .withMessage("Invalid, Phone must be only from SY, SA, or EG."),

  validatorMiddleware,
];
exports.deleteAddressValidator = [
  check("addressId").isMongoId().withMessage("Invalid address id format"),
  validatorMiddleware,
];
