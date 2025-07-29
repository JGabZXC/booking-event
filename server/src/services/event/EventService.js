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

  async getAllEvents(sort = "_id", page = 1, limit = 10) {
    let events = await this.eventRepository.getAllEvents(sort, page, limit);
    const updatedEvents = await this.imageUrlProvider.checkSignedExpiration(
      events.events,
      this.eventRepository
    );

    if (updatedEvents) {
      events = updatedEvents;
    }

    return events;
  }

  async getEvent(identifier) {
    let event = await this.eventRepository.getEvent(identifier);
    const updatedDoc = await this.imageUrlProvider.checkSignedExpiration(
      event,
      this.eventRepository
    );

    if (updatedDoc) event = updatedDoc;

    return event;
  }

  async updateEvent(identifier, eventData) {
    return await this.eventRepository.updateEvent(identifier, eventData);
  }

  async deleteEvent(identifier) {
    return await this.eventRepository.deleteEvent(identifier);
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
