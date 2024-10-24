const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/api-error");
const ApiFeatures = require("../utils/api_features");
const { deleteFile, deleteFiles } = require("../utils/delete-file");

const getSendedImage = (document) => {
  const image = document.image || document.imageCover || "";
  return image;
};

const deleteImages = async (document) => {
  if (document.images && document.images.length > 0)
    await deleteFiles(document.images);
};

const deleteImage = async (document) => {
  const image = getSendedImage(document);
  if (image !== "") await deleteFile(image);
  await deleteImages(document);
};

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document)
      return next(new ApiError(`No document for this id : ${id}`, 404));

    await deleteImage(document);

    await document.deleteOne();

    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document) {
      const image = req.body.image || req.body.imageCover;
      const preNameImage = image.split("-")[0];
      if (image) await deleteFile(`8000/${preNameImage}s/${image}`);
      return next(new ApiError(`No document for this id : ${id}`, 404));
    }
    const prevImage = getSendedImage(document);

    const newDocument = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const newImage = getSendedImage(newDocument);

    if (prevImage !== "" && prevImage !== newImage) await deleteFile(prevImage);

    await deleteImages(document);

    if (!newDocument)
      return next(new ApiError(`No document for this id : ${id}`, 404));
    //  Trigger <save> event when update newDocument
    await newDocument.save();
    res.status(200).json({ data: newDocument });
  });

exports.createOne = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    if (modelName === "Product")
      req.body.subcategories = [...new Set(req.body.subcategories)];
    const document = await Model.create(req.body);
    console.log(document);
    if (document) res.status(201).json({ data: document });
  });

exports.getOne = (Model, populateOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (populateOption) {
      query = query.populate(populateOption);
    }
    const document = await query;
    if (!document)
      return next(new ApiError(`No document for this id : ${id}`, 404));
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;
    const documentCount = await Model.countDocuments();
    // Initialize query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .sort()
      .filter()
      .limitFields()
      .pagination(documentCount)
      .search(modelName);

    // Execute query
    const { mongooseQuery, pagination } = apiFeatures;
    const documents = await mongooseQuery;
    if (documents)
      res
        .status(200)
        .json({ count: documents.length, pagination, data: documents });
  });
