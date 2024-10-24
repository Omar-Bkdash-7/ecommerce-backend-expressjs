const path = require("path");
const fs = require("fs");

const multer = require("multer");

const ApiError = require("../utils/api-error");

const multerOptions = () => {
  // ! To stoarge image without processing
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     console.log(file);
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}-${file.originalname.split(".")[0]}.${ext}`;
  //     console.log(filename);
  //     cb(null, filename);
  //   },
  // });

  // ! To stoarge image as buffer and processing it
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("only image allowd", 400), false);
    }
  };

  return multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 8 * 1024 * 1024 },
  });
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImage = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

exports.checkExtImage = (imageProcessing, ext) => {
  if (ext === "jpeg" || ext === "jpg") {
    imageProcessing = imageProcessing.toFormat("jpeg").jpeg({ quality: 90 });
  } else if (ext === "png") {
    imageProcessing = imageProcessing.toFormat("png").png({ quality: 90 });
  } else if (ext === "webp") {
    imageProcessing = imageProcessing.toFormat("webp").webp({ quality: 90 });
  }
  return imageProcessing;
};

exports.checkDirNameImage = (dirName) => {
  const dir = path.join(__dirname, `../uploads/${dirName}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
