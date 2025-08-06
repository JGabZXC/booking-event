import {
  BadRequestException,
  NotFoundException,
} from "../../utils/appError.js";
import slugify from "slugify";

export default class EventService {
  constructor(eventRepository, imageService, imageUrlProvider) {
    this.eventRepository = eventRepository;
    this.imageService = imageService;
    this.imageUrlProvider = imageUrlProvider;
  }

  async createEvent(eventData, files) {
    let event = await this.eventRepository.createEvent(eventData);

    if (files?.coverImage) {
      event.coverImage = await this.imageService.processImageFiles(
        files.coverImage[0], // Ensure coverImage is always selecting the first index
        event.title
      );
    }

    if (files?.images && files.images.length > 0) {
      event.images = await this.imageService.processImageFiles(
        files.images,
        event.title
      );
    }

    return await event.save({ validateModifiedOnly: true });
  }

  async getAllEvents(sort = "_id", page = 1, limit = 10, filter = "") {
    let events = await this.eventRepository.getAllEvents(
      sort,
      page,
      limit,
      filter
    );
    const updatedEvents = await this.imageUrlProvider.checkSignedExpiration(
      events.events,
      this.eventRepository
    );

    if (updatedEvents) {
      events = updatedEvents;
    }

    return events;
  }

  async getEvent(identifier, populateOptions) {
    let event = await this.eventRepository.getEvent(
      identifier,
      populateOptions
    );
    if (!event)
      throw new NotFoundException(
        "No event found with the provided identifier"
      );
    const updatedDoc = await this.imageUrlProvider.checkSignedExpiration(
      event,
      this.eventRepository
    );

    if (updatedDoc) event = updatedDoc;

    return event;
  }

  async updateEvent(identifier, eventData, files) {
    if (eventData.attendees)
      return new BadRequestException(
        "Attendees cannot be updated directly.",
        ErrorCode.VALIDATION_ERROR
      );

    if (eventData.title) {
      eventData.slug = slugify(eventData.title, {
        lower: true,
        trim: true,
        replacement: "-",
      });
    }

    if (files?.coverImage) {
      eventData.coverImage = await this.imageService.processImageFiles(
        files.coverImage[0],
        eventData.title
      );
    }

    if (files?.images && files.images.length > 0) {
      eventData.images = await this.imageService.processImageFiles(
        files.images,
        eventData.title
      );
    }

    const updatedEvent = await this.eventRepository.updateEvent(
      identifier,
      eventData
    );
    if (!updatedEvent)
      return new NotFoundException(
        "No event found with the provided identifier"
      );

    return updatedEvent;
  }

  async deleteEvent(identifier) {
    const event = await this.eventRepository.deleteEvent(identifier);

    if (!event)
      return new NotFoundException(
        "No event was found with the provided ID",
        ErrorCode.RESOURCE_NOT_FOUND
      );

    if (event.coverImage?.fileName) {
      await this.imageService.deleteImage(event.coverImage.fileName);
    }

    if (event.images && event.images.length > 0) {
      await Promise.all(
        event.images.map((image) =>
          this.imageService.deleteImage(image.fileName)
        )
      );
    }

    return event;
  }

  async getEventsByUserIdOrEmail(
    identifier,
    sort = "_id",
    page = 1,
    limit = 10
  ) {
    return await this.ticketRepository.getEventsByUserIdOrEmail(
      identifier,
      sort,
      page,
      limit
    );
  }
}
