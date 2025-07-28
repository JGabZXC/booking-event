export default class EventService {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async getAllEvents(sort = "_id", page = 1, limit = 10) {
    return await this.eventRepository.getAllEvents(sort, page, limit);
  }

  async getEventById(id) {
    return await this.eventRepository.getEventById(id);
  }

  async createEvent(eventData) {
    return await this.eventRepository.createEvent(eventData);
  }

  async updateEventById(eventId, eventData) {
    return await this.eventRepository.updateEventById(eventId, eventData);
  }

  async deleteEventById(eventId) {
    return await this.eventRepository.deleteEventById(eventId);
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
