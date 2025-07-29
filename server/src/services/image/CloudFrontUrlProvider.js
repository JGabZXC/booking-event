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

    // Helper to check and update a single document
    const updateIfExpired = async (doc) => {
      const updateFields = {};

      // Cover image expiration
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

      // Images expiration
      const images = doc.images || [];
      const isImagesExpired =
        images.length > 0 &&
        images[0].urlExpires &&
        new Date(images[0].urlExpires) < new Date();

      if (isImagesExpired) {
        updateFields.images = images.map((image) => ({
          ...image._doc,
          url: this.signUrl(image.fileName, expiresAt),
          urlExpires: expiresAt,
        }));
      }

      if (Object.keys(updateFields).length > 0) {
        return await eventRepository.updateEvent(doc._id, updateFields);
      }
      return null;
    };

    let updatedDocs = [];
    if (Array.isArray(documents)) {
      const results = await Promise.all(documents.map(updateIfExpired));
      updatedDocs = results.filter(Boolean);
    } else {
      const result = await updateIfExpired(documents);
      updatedDocs = result ? [result] : [];
    }

    console.log(
      updatedDocs.length > 0
        ? `Updated ${updatedDocs.length} documents with new signed URLs.`
        : `Signed URLs are still valid for all documents.`
    );
    return updatedDocs.length > 0 && updatedDocs;
  }
}
