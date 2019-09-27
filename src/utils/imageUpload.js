import multer, { MulterError } from "multer";
import multerConfig from "../config/multer";

const imageUpload = multer(multerConfig).single("file");

export { imageUpload, MulterError, multer };
