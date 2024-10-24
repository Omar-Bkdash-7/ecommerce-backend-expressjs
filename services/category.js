const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const Category = require("../models/category");
const factory = require("./handlers-factory");



const {
  uploadSingleImage,
  checkExtImage,
  checkDirNameImage,
} = require("../middleware/upload-image");

exports.uploadCategoryImage = uploadSingleImage("image");

// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(600, 600)
//     .toFormat("jpeg")
//     .jpeg({ quality: 90 })
//     .toFile(`uploads/categories/${filename}`);
//   req.body.image = filename;
//   next();
// });

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if(req.file){
  checkDirNameImage("categories");

  const ext = req.file.mimetype.split("/")[1];
  const filename = `category-${uuidv4()}-${Date.now()}-${req.file.originalname.split(".")[0]}.${ext}`;

  let imageProcessing = sharp(req.file.buffer).resize(600, 600);

  imageProcessing = checkExtImage(imageProcessing, ext);

  await imageProcessing.toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  }
  next();
});

// @desc Get list of category
// @route Get /api/category
// @access Public
exports.getCategories = factory.getAll(Category);

// @desc Get category by id
// @route GET /api/category/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @desc Create category
// @route POST /api/category
// @access Private/Admin-Manager
exports.postCategory = factory.createOne(Category);

// @desc update category
// @route PUT /api/category/:id
// @access Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

// @desc delete category by id
// @route DELETE /api/category/:id
// @access Private/Admin
exports.deleteCategory = factory.deleteOne(Category);
