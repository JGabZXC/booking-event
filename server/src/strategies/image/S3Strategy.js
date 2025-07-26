import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../../services/image/s3Client.js";
import IImageServiceStrategy from "../../interfaces/IImageServiceStrategy.js";

export default class AWSS3 extends IImageServiceStrategy {
  constructor(bucketName) {
    super();
    this.s3Client = s3Client;
    this.bucketName = bucketName;
  }

  async uploadImage(data) {
    console.log("Proceeded in uploadingImage");
    console.log(data);
    const params = {
      Bucket: this.bucketName,
      Key: data.originalname,
      Body: data.buffer,
      ContentType: data.mimetype,
    };

    const command = new PutObjectCommand(params);
    return await this.s3Client({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
    }).send(command);
  }

  getImageUrl(key) {
    // Implement the logic to get the image URL from AWS S3
  }
}
