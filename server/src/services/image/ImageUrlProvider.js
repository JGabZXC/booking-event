export default class ImageUrlProvider {
  constructor(urlProvider) {
    this.urlProvider = urlProvider;
  }

  signUrl(imagePath, expiresAt) {
    return this.urlProvider.signUrl(imagePath, expiresAt);
  }

  async checkSignedExpiration(documents, eventRepository) {
    return this.urlProvider.checkSignedExpiration(documents, eventRepository);
  }
}
