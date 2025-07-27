import { BadRequestException } from "../../utils/appError.js";

export default class TicketImageService {
  constructor(imageService, ticketRepository) {
    this.imageService = imageService;
    this.ticketRepository = ticketRepository;
  }

  async createTicket(body, files) {
    let ticket = await this.ticketRepository.createTicket(body);
    if (!ticket) throw new BadRequestException("Ticket creation failed");

    if (files?.coverImage) {
      const fileName = await this.imageService.uploadImage(
        files.coverImage[0],
        body.title
      );
      const url = await this.imageService.getImageUrl(fileName);
      ticket.coverImage = { fileName, url };
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

      ticket.images = fileNames.map((fileName, index) => ({
        fileName,
        url: urls[index],
      }));
    }

    return ticket.save({ validateModifiedOnly: true });
  }
}
