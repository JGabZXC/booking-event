export default class IEventRepository {
  async getAllEvents(sort = "_id", page = 1, limit = 10) {
    throw new Error("Method not implemented");
  }

  async getEvent(id) {
    throw new Error("Method not implemented");
  }

  async createEvent(eventData) {
    throw new Error("Method not implemented");
  }

  async updateEvent(eventId, eventData) {
    throw new Error("Method not implemented");
  }

  async deleteEvent(eventId) {
    throw new Error("Method not implemented");
  }

  async getEventsByUserIdOrEmail(
    identifier,
    sort = "_id",
    page = 1,
    limit = 10
  ) {
    throw new Error("Method not implemented");
  }
}
