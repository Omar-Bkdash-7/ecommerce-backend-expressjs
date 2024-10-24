const express = require("express");
const AuthService = require("../services/auth");

const {
  getUserValidator,
  deleteUserValidator,
  updateUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateLoggedPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/user");

const router = express.Router();

const {
  getUsers,
  postUser,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  uploadUserImage,
  resizeImage,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../services/user");

router.get("/get-me", AuthService.protect, getLoggedUserData, getUser);
router.put(
  "/update-logged-user-password",
  AuthService.protect,
  updateLoggedPasswordValidator,
  updateLoggedUserPassword
);

router.put(
  "/update-me",
  AuthService.protect,
  updateLoggedUserValidator,
  updateLoggedUserData
);

router.delete("/delete-me", AuthService.protect, deleteLoggedUser);

router.use(AuthService.protect, AuthService.allowedTo("admin"));

router.put("/change-password/:id", changeUserPasswordValidator, changePassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, postUser);

router
  .route("/:id")
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser)
  .get(getUserValidator, getUser);

module.exports = router;
