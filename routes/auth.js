const express = require("express");
const {
  sginupValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordvalidator,
} = require("../utils/validators/auth");

const router = express.Router();

const { signup, login } = require("../services/auth");
const {
  forgetPassword,
  verifyPassword,
  resetPassword,
} = require("../services/foget-reset-password");

router.post("/sginup", sginupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
router.post("/verifyPassword", verifyPassword);
router.put("/resetPassword", resetPasswordvalidator, resetPassword);

module.exports = router;
