import slugify from "slugify";

export default class ImageService {
  constructor(imageStrategy, bucketName) {
    this.imageStrategy = imageStrategy;
    this.bucketName = bucketName;
  }

  async uploadImage(data, eventTitle) {
    const fileName = this.generateImageName(data.originalname, eventTitle);
    const params = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: data.buffer,
      ContentType: data.mimetype,
    };

    await this.imageStrategy.uploadImage(params);
    return fileName;
  }

  async getImageUrl(imageName, expiresAt) {
    return this.imageStrategy.getImageUrl(imageName, expiresAt);
  }

  generateImageName(originalName, eventTitle) {
    const timestamp = Date.now();
    const extension = originalName.split(".").pop();
    const slugifiedTitle = slugify(eventTitle, {
      lower: true,
      strict: true,
      trim: true,
      replacement: "_",
    });
    return `ticket-${slugifiedTitle}-${timestamp}.${extension}`;
  }
}
