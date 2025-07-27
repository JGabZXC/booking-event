import sharp from "sharp";

export default class SharpProcessorStrategy {
  async resizeImage(buffer, width, height) {
    return await sharp(buffer).resize(width, height).toBuffer();
  }

  async convertToWebP(file) {
    const buffer = await sharp(file.buffer).webp().toBuffer();
    const mimetype = "image/webp";
    const originalname = file.originalname.replace(/\.[^/.]+$/, ".webp");

    return { buffer, mimetype, originalname };
  }
}
