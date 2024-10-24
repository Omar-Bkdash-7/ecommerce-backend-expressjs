const SubCategory = require("../models/subcategory");
const factory = require("./handlers-factory");

exports.setSubCategory = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc Create subcategory
// @route POST /api/subcategory
// @access Private/Admin-Manager
exports.postSubCategory = factory.createOne(SubCategory);

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc Get list of subcategory
// @route Get /api/subcategory
// @access Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc Get subcategory by id
// @route GET /api/subcategory/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc update subcategory
// @route PUT /api/subcategory/:id
// @access Private/Admin-Manager
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc delete subcategory by id
// @route DELETE /api/subcategory/:id
// @access Private/Admin
exports.deleteSubCategory = factory.deleteOne(SubCategory);
