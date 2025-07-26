import sharp from "sharp";

export default class ImageProcessorService {
  constructor(imageProcessorStrategy) {
    this.imageProcessorStrategy = imageProcessorStrategy;
  }
  async resizeImage(buffer, width, height) {
    return await this.imageProcessorStrategy.resizeImage(buffer, width, height);
  }

  async convertToWebP(buffer) {
    return await this.imageProcessorStrategy.convertToWebP(buffer);
  }
}
