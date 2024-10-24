const fs = require("fs");

exports.deleteFile = async (filePath) => {
  filePath = `uploads${filePath.split("8000")[1]}`;
  fs.unlink(filePath, (err) => {
    if (err) {
      throw new Error("Can't delete file");
    }
  });
};

exports.deleteFiles = async (filesPath) => {
  filesPath.forEach((path) => {
    path = `uploads${path.split("8000")[1]}`;
    console.log(path);
    fs.unlink(path, (err) => {
      if (err) {
        throw new Error("Can't delete array of files");
      }
    });
  });
};
