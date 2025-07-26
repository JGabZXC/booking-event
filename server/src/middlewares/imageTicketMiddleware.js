import container from "../container/container.js";

const imageProcessorService = container.get("imageProcessorService");
const imageService = container.get("imageService");

export default async (req, res, next) => {
  if (req.files?.coverImage)
    req.files.coverImage[0].buffer = await imageProcessorService.resizeImage(
      req.files.coverImage[0].buffer,
      1920,
      1080
    );

  if (req.files?.images && req.files.images.length > 0)
    req.files.images = await Promise.all(
      req.files.images.map(async (file) => {
        file.buffer = await imageProcessorService.resizeImage(
          file.buffer,
          1920,
          1080
        );
        return file;
      })
    );

  // CHANGE THIS LATER
  // Save the image to S3 regarding the creation of the ticket is successful or not
  if (req.files?.coverImage) {
    req.body.coverImage = await imageService.uploadImage(
      req.files.coverImage[0]
    );
  }

  next();
};
