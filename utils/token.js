const jwt = require("jsonwebtoken");

exports.createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.getVerifyCode = (verifyCode) =>
  crypto.createHash("sha256").update(verifyCode).digest("hex");
