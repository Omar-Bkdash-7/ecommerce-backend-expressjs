const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");

const Brand = require("../models/brand");
const factory = require("./handlers-factory");

const {
  uploadSingleImage,
  checkExtImage,
  checkDirNameImage,
} = require("../middleware/upload-image");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if(req.file){
  checkDirNameImage("brands");

  const ext = req.file.mimetype.split("/")[1];
  const filename = `brand-${uuidv4()}-${Date.now()}-${req.file.originalname.split(".")[0]}.${ext}`;

  let imageProcessing = sharp(req.file.buffer).resize(600, 600);

  imageProcessing = checkExtImage(imageProcessing, ext);

  await imageProcessing.toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  }
  next();
});

// @desc Get list of brand
// @route Get /api/brand
// @access Public
exports.getBrands = factory.getAll(Brand);

// @desc Get brand by id
// @route GET /api/brand/:id
// @access Public
exports.getBrand = factory.getOne(Brand);

// @desc Create brand
// @route POST /api/brand
// @access Private/Admin-Manager
exports.postBrand = factory.createOne(Brand);

// @desc update brand
// @route PUT /api/brand/:id
// @access Private/Admin-Manager
exports.updateBrand = factory.updateOne(Brand);

// @desc delete brand by id
// @route DELETE /api/brand/:id
// @access Private/Admin
exports.deleteBrand = factory.deleteOne(Brand);
