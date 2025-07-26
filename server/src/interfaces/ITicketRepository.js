export default class ITicketRepository {
  async getAllTickets(sort = "_id", page = 1, limit = 10) {
    throw new Error("Method not implemented");
  }

  async getTicket(id) {
    throw new Error("Method not implemented");
  }

  async createTicket(ticketData) {
    throw new Error("Method not implemented");
  }

  async updateTicketById(ticketId, ticketData) {
    throw new Error("Method not implemented");
  }

  async deleteTicketById(ticketId) {
    throw new Error("Method not implemented");
  }

  async getTicketsByUserIdOrEmail(
    identifier,
    sort = "_id",
    page = 1,
    limit = 10
  ) {
    throw new Error("Method not implemented");
  }
}
