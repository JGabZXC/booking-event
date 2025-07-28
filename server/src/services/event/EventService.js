export default class EventService {
  constructor(eventRepository, imageService, imageUrlProvider) {
    this.eventRepository = eventRepository;
    this.imageService = imageService;
    this.imageUrlProvider = imageUrlProvider;
  }

  async createEvent(eventData) {
    return await this.eventRepository.createEvent(eventData);
  }

  async getAllEvents(sort = "_id", page = 1, limit = 10) {
    return await this.eventRepository.getAllEvents(sort, page, limit);
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
