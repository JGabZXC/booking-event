import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../services/image/s3Client.js";
import IImageServiceStrategy from "../../interfaces/IImageServiceStrategy.js";

export default class AWSS3 extends IImageServiceStrategy {
  constructor(imageUrlProvider) {
    super();
    this.s3Client = s3Client;
    this.imageUrlProvider = imageUrlProvider;
  }

  async uploadImage(params) {
    const command = new PutObjectCommand(params);
    return await this.s3Client().send(command);
  }

  async getImageUrl(imageName, expiresAt) {
    return this.imageUrlProvider.signUrl(imageName, expiresAt);
  }
}
