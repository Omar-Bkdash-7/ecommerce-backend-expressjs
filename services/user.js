const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const factory = require("./handlers-factory");
const ApiError = require("../utils/api-error");
const { createToken } = require("../utils/token");
const { deleteFile } = require("../utils/delete-file");

const {
  uploadSingleImage,
  checkExtImage,
  checkDirNameImage,
} = require("../middleware/upload-image");

exports.uploadUserImage = uploadSingleImage("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    checkDirNameImage("users");

    const ext = req.file.mimetype.split("/")[1];
    const filename = `user-${uuidv4()}-${Date.now()}-${req.file.originalname.split(".")[0]}.${ext}`;

    let imageProcessing = sharp(req.file.buffer).resize(600, 600);

    imageProcessing = checkExtImage(imageProcessing, ext);

    await imageProcessing.toFile(`uploads/users/${filename}`);
    req.body.profileImage = filename;
  }
  next();
});

// @desc Get list of user
// @route Get /api/users
// @access Private/Admin
exports.getUsers = factory.getAll(User);

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
exports.getUser = factory.getOne(User);

// @desc Create user
// @route POST /api/users
// @access Private/Admin
exports.postUser = factory.createOne(User);

// @desc update user
// @route PUT /api/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const document = await User.findById(id);
  if (!document)
    return next(new ApiError(`No document for this id : ${id}`, 404));

  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImage: req.body.profileImage,
    },
    { new: true }
  );
  if (!user) return next(new ApiError(`No user for this id : ${id}`, 404));
  console.log(document.profileImage);
  if (document.profileImage && document.profileImage !== user.profileImage)
    await deleteFile(document.profileImage);

  res.status(200).json({ data: user });
});

// @desc Admin Change Password
// @route PUT /api/users/change-password/:id
// @access Private/Admin
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const user = await User.findByIdAndUpdate(
    _id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) return next(new ApiError(`No user for this id : ${_id}`, 404));
  res.status(200).json({ data: user });
});

// @desc delete user by id
// @route DELETE /api/users/:id
// @access Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc Get logged user
// @route GET /api/users/get-me
// @access Private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params._id = req.user._id;
  next();
});

// @desc Get logged user
// @route DELETE /api/users/getme
// @access Private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params._id = req.user._id;
  next();
});

// @desc Change Password by user
// @route PUT /api/users/update-logged-user-password/:id
// @access Public/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user._id;
  const user = await User.findByIdAndUpdate(
    _id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) return next(new ApiError(`No user for this id : ${_id}`, 404));

  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc Update logged user data (without password ,role ,active)
// @route PUT /api/users/update-me
// @access Public/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const { _id } = req.user._id;
  const user = await User.findByIdAndUpdate(
    _id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  if (!user) return next(new ApiError(`No user for this id : ${_id}`, 404));

  res.status(200).json({ data: user });
});

// @desc delete logged user (by conver active to false)
// @route DELETE /api/users/delete-me
// @access Public/protect
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true });

  res.status(200).json({ status: "Success" });
});
