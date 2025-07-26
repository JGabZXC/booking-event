export default class IImageServiceStrategy {
  async uploadImage(file) {
    throw new Error("uploadImage() must be implemented by strategy");
  }

  async deleteImage(key) {
    throw new Error("deleteImage() must be implemented by strategy");
  }

  async patchImage(file, key) {
    throw new Error("patchImage() must be implemented by strategy");
  }

  async getImageUrl(key) {
    throw new Error("getImageUrl() must be implemented by strategy");
  }
}
