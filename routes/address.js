const express = require("express");
const AuthService = require("../services/auth");

const {
  createAddressValidator,
  deleteAddressValidator,
} = require("../utils/validators/address");

const router = express.Router();

const {
  addAddress,
  removeAddress,
  getAllAddress,
} = require("../services/address");

router.use(AuthService.protect, AuthService.allowedTo("user"));

router.route("/").post(createAddressValidator, addAddress).get(getAllAddress);

router.delete("/:addressId", deleteAddressValidator, removeAddress);

module.exports = router;
