export default class ImageService {
  constructor(imageStrategy) {
    this.strategy = imageStrategy;
  }

  async uploadImage(file) {
    return await this.strategy.uploadImage(file);
  }
  async getImageUrl(fileImage) {}
}
