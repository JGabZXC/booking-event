import container from "../container/container.js";

const imageProcessorService = container.get("imageProcessorService");

export default async (req, res, next) => {
  if (req.files?.coverImage) {
    req.files.coverImage[0].buffer = await imageProcessorService.resizeImage(
      req.files.coverImage[0].buffer,
      1920,
      1080
    );
    req.files.coverImage[0].buffer = await imageProcessorService.convertToWebP(
      req.files.coverImage[0].buffer
    );
    req.files.coverImage[0].mimetype = "image/webp";
    req.files.coverImage[0].originalname =
      req.files.coverImage[0].originalname.replace(/\.[^/.]+$/, ".webp");
  }

  if (req.files?.images && req.files.images.length > 0)
    req.files.images = await Promise.all(
      req.files.images.map(async (file) => {
        file.buffer = await imageProcessorService.resizeImage(
          file.buffer,
          1920,
          1080
        );
        file.buffer = await imageProcessorService.convertToWebP(file.buffer);
        file.mimetype = "image/webp";
        file.originalname = file.originalname.replace(/\.[^/.]+$/, ".webp");
        return file;
      })
    );
  next();
};
