import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = (data) => {
  return new S3Client({
    credentials: {
      accessKeyId: data.accessKeyId,
      secretAccessKey: data.secretAccessKey,
    },
    region: data.region,
  });
};
