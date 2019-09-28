import multer from "multer";
import path from "path";
import crypto from "crypto";

const multer_upload = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err);

        const filename = `${hash.toString("hex")}-${file.originalname}`;
        //console.log(filename);
        callback(null, filename);
      });
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];
    if (allowedMimes.includes(file.mimetype)) callback(null, true);
    else callback(new Error("Invalid file type."));
  },
  onError: function(err, next) {
    console.log("error", err);
    next(err);
  }
};

export default multer_upload;
