import { BadRequestException } from "../../utils/appError.js";
import generateDateExpiration from "../../utils/generateDateExpiration.js";

export default class EventImageService {
  constructor(imageService, eventRepository, imageUrlProvider) {
    this.imageService = imageService;
    this.eventRepository = eventRepository;
    this.imageUrlProvider = imageUrlProvider;
  }

  async createEvent(body, files) {
    let event = await this.eventRepository.createEvent(body);
    if (!event) throw new BadRequestException("Event creation failed");

    const expiresAt = generateDateExpiration(30); // Set expiration to 30 days

    if (files?.coverImage) {
      const fileName = await this.imageService.uploadImage(
        files.coverImage[0],
        body.title
      );
      const url = await this.imageService.getImageUrl(fileName);
      event.coverImage = { fileName, url, urlExpires: expiresAt };
    }

    if (files?.images && files.images.length > 0) {
      const fileNames = await Promise.all(
        files.images.map((file) =>
          this.imageService.uploadImage(file, body.title)
        )
      );
      const urls = await Promise.all(
        fileNames.map((fileName) => this.imageService.getImageUrl(fileName))
      );

      event.images = fileNames.map((fileName, index) => ({
        fileName,
        url: urls[index],
        urlExpires: expiresAt,
      }));
    }

    return await event.save({ validateModifiedOnly: true });
  }
}
