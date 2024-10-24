const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
// To processing image
const sharp = require("sharp");

const Product = require("../models/product");
const factory = require("./handlers-factory");

const {
  uploadMixOfImage,
  checkExtImage,
  checkDirNameImage,
} = require("../middleware/upload-image");

exports.uploadProductImage = uploadMixOfImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.files) {
    checkDirNameImage("products");

    const { files } = req;
    if (files.imageCover) {
      const ext = files.imageCover[0].mimetype.split("/")[1];
      const fileImageCoverName = `product-${uuidv4()}-${Date.now()}-${files.imageCover[0].originalname.split(".")[0]}-cover.${ext}`;

      let imageProcessing = sharp(files.imageCover[0].buffer).resize(
        2000,
        1333
      );

      imageProcessing = checkExtImage(imageProcessing, ext);

      await imageProcessing.toFile(`uploads/products/${fileImageCoverName}`);
      req.body.imageCover = fileImageCoverName;
    }
    if (files.images) {
      req.body.images = [];
      await Promise.all(
        files.images.map(async (image, index) => {
          const ext = image.mimetype.split("/")[1];
          const fileImageName = `product-${uuidv4()}-${Date.now()}-${image.originalname.split(".")[0]}-${index + 1}.${ext}`;

          let imageProcessing = sharp(image.buffer).resize(2000, 1333);

          imageProcessing = checkExtImage(imageProcessing, ext);

          await imageProcessing.toFile(`uploads/products/${fileImageName}`);
          req.body.images.push(fileImageName);
        })
      );
    }
  }
  next();
});

// @desc Get list of prodect
// @route Get /api/prodect
// @access Public
exports.getProducts = factory.getAll(Product, "Product");

// @desc Get product by id
// @route GET /api/product/:id
// @access Public
exports.getProduct = factory.getOne(Product, "reviews");

// @desc Create product
// @route POST /api/product
// @access Private/Admin-Manager
exports.postProduct = factory.createOne(Product, "Product");

// @desc update product
// @route PUT /api/product/:id
// @access Private/Admin-Manager
exports.updateProduct = factory.updateOne(Product);

// @desc delete product by id
// @route DELETE /api/product/:id
// @access Private/Admin
exports.deleteProduct = factory.deleteOne(Product);
