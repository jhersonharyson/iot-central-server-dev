const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");

const imageUpload = multer(multerConfig).single("file");

exports.post = (req, res, next) => {
  imageUpload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ upload: "validation MulterError" });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ upload: "unknown error" });
    }
    console.log(req.file);
    return res.status(200).json({ upload: "success" });
  });
};
