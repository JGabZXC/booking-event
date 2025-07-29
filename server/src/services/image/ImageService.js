import slugify from "slugify";
import { CLOUDFRONT_EXPIRATION_DAY } from "../../config/const.js";
import generateDateExpiration from "../../utils/generateDateExpiration.js";

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

  async deleteImage(imageName) {
    const params = {
      Bucket: this.bucketName,
      Key: imageName,
    };

    return await this.imageStrategy.deleteImage(params);
  }

  async getImageUrl(imageName, expiresAt) {
    return this.imageStrategy.getImageUrl(imageName, expiresAt);
  }

  generateImageName(originalName, eventTitle) {
    const timestamp = Date.now();
    const extension = originalName.split(".").pop();
    const slugifiedTitle = slugify(eventTitle, {
      lower: true,
      trim: true,
      replacement: "_",
    });
    return `event-${slugifiedTitle}-${timestamp}.${extension}`;
  }

  async processImageFiles(files, title) {
    const expiresAt = generateDateExpiration(CLOUDFRONT_EXPIRATION_DAY);

    // Ensure files is always an array
    const inputFiles = Array.isArray(files) ? files : [files];

    const fileNames = await Promise.all(
      inputFiles.map((file) => this.uploadImage(file, title))
    );
    const urls = await Promise.all(
      fileNames.map((fileName) => this.getImageUrl(fileName, expiresAt))
    );

    const results = fileNames.map((fileName, index) => ({
      fileName,
      url: urls[index],
      urlExpires: expiresAt,
    }));

    // Return single object if input was single file
    return Array.isArray(files) ? results : results[0];
  }
}
