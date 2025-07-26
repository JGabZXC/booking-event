import sharp from "sharp";

export default class SharpProcessorStrategy {
  async resizeImage(buffer, width, height) {
    return await sharp(buffer).resize(width, height).toBuffer();
  }

  async convertToWebP(buffer) {
    return await sharp(buffer).webp().toBuffer();
  }
}
