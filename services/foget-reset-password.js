const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const ApiError = require("../utils/api-error");
const sendEmail = require("../utils/send-email");
const { createToken, getVerifyCode } = require("../utils/token");

// @desc    Forget password
// @route   POST /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`Not found user have this email ${req.body.email}`, 404)
    );
  }
  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashPassoVerifyCode = getVerifyCode(verifyCode);

  // Save hased verify code in db
  user.passwordVerifyCode = hashPassoVerifyCode;
  // This verify code will expires after 15 min
  user.passwordVerifyExpires = 15 * 60 * 1000 + Date.now();
  // Initilize passwordVerifed
  user.passwordVerifed = false;

  await user.save();

  // Send the reset code via email
  try {
    const message = `Hi ${user.name},\n We received a request to reset the password on your Ecommerce-node Account. \n ${verifyCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Ecommerce-node Team`;

    await sendEmail({
      email: user.email,
      subject: "Your verify password (valid for 15 min).",
      message,
    });
  } catch (err) {
    // return config this value to undefined on database
    user.passwordVerifyCode = undefined;
    user.passwordVerifyExpires = undefined;
    user.passwordVerifed = undefined;
    await user.save();
    return next(
      new ApiError("There is an error throw sending verify code.", 500)
    );
  }

  res.status(200).json({
    status: "Success",
    message: "Had sended verify code to this email",
  });
});

// @desc    Verify password
// @route   POST /api/v1/auth/verifyPassword
// @access  Public
exports.verifyPassword = asyncHandler(async (req, res, next) => {
  const hashPassoVerifyCode = getVerifyCode(req.body.verifyCode);

  const user = await User.findOne({
    passwordVerifyCode: hashPassoVerifyCode,
    passwordVerifyExpires: { $gt: Date.now() },
  });
  if (!user) return next(new ApiError("Verify code invalid or expired"), 403);

  req.passwordVerifed = true;

  req.status(200).json({ status: "Success" });
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new ApiError(`This email ${req.body.emial} not valid.`), 404);

  if (!req.passwordVerifed)
    return next(new ApiError("Please enter the verification code first."));

  user.password = req.body.newPassword;

  user.passwordVerifyCode = undefined;
  user.passwordVerifyExpires = undefined;
  user.passwordVerifed = undefined;
  await user.save();

  const token = createToken(user._id);

  req.status(200).json({ status: "Success", token });
});
