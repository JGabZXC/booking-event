export default class ImageUrlProvider {
  constructor(urlProvider) {
    this.urlProvider = urlProvider;
    // this.expiresAt = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    this.expiresAt = () => new Date(Date.now() + 3 * 1000); // 3 seconds
  }

  signUrl(imagePath) {
    return this.urlProvider.signUrl(imagePath, this.expiresAt());
  }

  async checkSignedExpiration(documents, eventRepository) {
    return this.urlProvider.checkSignedExpiration(documents, eventRepository);
  }
}
