const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const ApiError = require("../utils/api-error");
const { createToken } = require("../utils/token");

// @desc Sginup
// @route Get /api/sginup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });
  //  Create token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc Login
// @route Get /api/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new ApiError("Email or password not vaild.", 401));

  //  Create token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc check if user is register or not
exports.protect = asyncHandler(async (req, res, next) => {
  // Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new ApiError("Token is expired , Please login agian.", 401));

  // Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //  Check if user exists
  const user = await User.findById(decoded.userId);
  if (!user)
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist ",
        401
      )
    );
  // Check if user is active
  if (!user.active) return next(new ApiError("User is not active.", 404));

  // Check if user change his password after token created
  if (user.passwordChangedAt) {
    // conver time expired password form (ms to s)
    const passChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    //  check if password change after token created => error
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password , please login again.",
          401
        )
      );
    }
  }

  req.user = user;
  next();
});

// @desc check if user is register or not
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // Access only registered user (req.user.roles)
    if (!roles.includes(req.user.roles))
      return next(new ApiError("You don't have permission to do that.", 403));
    next();
  });
