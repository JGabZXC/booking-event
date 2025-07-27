import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../services/image/s3Client.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import IImageServiceStrategy from "../../interfaces/IImageServiceStrategy.js";

export default class AWSS3 extends IImageServiceStrategy {
  constructor() {
    super();
    this.s3Client = s3Client;
  }

  async uploadImage(params) {
    const command = new PutObjectCommand(params);
    return await this.s3Client().send(command);
  }

  async getImageUrl(params) {
    return await getSignedUrl(this.s3Client(), new GetObjectCommand(params), {
      expiresIn: 3600,
    });
  }
}
