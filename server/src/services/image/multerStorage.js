import multer from "multer";
import { BadRequestException } from "../../utils/appError.js";

export const storage = multer.memoryStorage();

export const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new BadRequestException("Only image files are allowed!"), false);
  }
};

export const upload = multer({ storage, fileFilter: multerFilter });

export const uploadImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);
