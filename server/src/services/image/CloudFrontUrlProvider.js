import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export default class CloudFrontUrlProvider {
  constructor(cloudFrontUrl, privateKey, keyPairId) {
    this.cloudFrontUrl = cloudFrontUrl;
    this.privateKey = privateKey;
    this.keyPairId = keyPairId;
  }

  signUrl(imagePath, expiresAt) {
    return getSignedUrl({
      url: `${this.cloudFrontUrl}/${imagePath}`,
      dateLessThan: expiresAt,
      privateKey: this.privateKey,
      keyPairId: this.keyPairId,
    });
  }

  async checkSignedExpiration(documents, eventRepository) {
    const expiresAt = this.expiresAt();
    const updatedDocs = await Promise.all(
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

    const filteredDocs = updatedDocs.filter(Boolean);
    // console.log(`Updated ${filteredDocs.length} documents with new signed URLs.` ? `Signed URLs are still valid for all documents.`);
    return filteredDocs.length > 0 && filteredDocs;
  }
}
