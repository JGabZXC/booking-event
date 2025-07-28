import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import generateDateExpiration from "../../utils/generateDateExpiration.js";
import { CLOUDFRONT_EXPIRATION_DAY } from "../../config/const.js";

export default class CloudFrontUrlProvider {
  constructor(cloudFrontUrl, privateKey, keyPairId) {
    this.cloudFrontUrl = cloudFrontUrl;
    this.privateKey = privateKey;
    this.keyPairId = keyPairId;
    this.expiresAt = () => generateDateExpiration(CLOUDFRONT_EXPIRATION_DAY);
  }

  signUrl(imagePath, expiresAt = this.expiresAt()) {
    return getSignedUrl({
      url: `${this.cloudFrontUrl}/${imagePath}`,
      dateLessThan: expiresAt,
      privateKey: this.privateKey,
      keyPairId: this.keyPairId,
    });
  }

  async checkSignedExpiration(documents, eventRepository) {
    const expiresAt = this.expiresAt();

    let updatedDocs = null;
    let filteredDocs = [];
    if (Array.isArray(documents)) {
      updatedDocs = await Promise.all(
        documents.map(async (doc) => {
          const updateFields = {};
          if (
            doc.coverImage?.urlExpires &&
            new Date(doc.coverImage.urlExpires) < new Date()
          ) {
            updateFields.coverImage = {
              ...doc.coverImage,
              url: this.signUrl(doc.coverImage.fileName, expiresAt),
              urlExpires: expiresAt,
            };
          }
          const isImagesExpired =
            doc.images.length > 0 &&
            doc.images[0].urlExpires &&
            new Date(doc.images[0].urlExpires) < new Date();

          if (isImagesExpired) {
            updateFields.images = doc.images.map((image) => ({
              ...image,
              url: this.signUrl(image.fileName, expiresAt),
              urlExpires: expiresAt,
            }));
          }

          if (Object.keys(updateFields).length > 0) {
            return await eventRepository.updateEvent(doc._id, {
              new: true,
            });
          }

          return null;
        })
      );
      filteredDocs = updatedDocs.filter(Boolean);
    } else {
      const updateFields = {};
      if (
        documents.coverImage?.urlExpires &&
        new Date(documents.coverImage.urlExpires) < new Date()
      ) {
        updateFields.coverImage = {
          ...documents.coverImage,
          url: this.signUrl(documents.coverImage.fileName, expiresAt),
          urlExpires: expiresAt,
        };
      }
      const isImagesExpired =
        documents.images.length > 0 &&
        documents.images[0].urlExpires &&
        new Date(documents.images[0].urlExpires) < new Date();

      if (isImagesExpired) {
        updateFields.images = documents.images.map((image) => ({
          ...image,
          url: this.signUrl(image.fileName, expiresAt),
          urlExpires: expiresAt,
        }));
      }

      if (Object.keys(updateFields).length > 0) {
        updatedDocs = await eventRepository.updateEvent(
          documents._id,
          updateFields
        );
      } else {
        updatedDocs = null;
      }
      filteredDocs = updatedDocs ? [updatedDocs] : [];
    }

    console.log(
      filteredDocs.length > 0
        ? `Updated ${filteredDocs.length} documents with new signed URLs.`
        : `Signed URLs are still valid for all documents.`
    );
    return filteredDocs.length > 0 && filteredDocs;
  }
}
