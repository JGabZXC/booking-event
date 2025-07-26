export default class TicketService {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async getAllTickets(sort = "_id", page = 1, limit = 10) {
    return await this.ticketRepository.getAllTickets(sort, page, limit);
  }

  async getTicketById(id) {
    return await this.ticketRepository.getTicketById(id);
  }

  async createTicket(ticketData) {
    return await this.ticketRepository.createTicket(ticketData);
  }

  async updateTicketById(ticketId, ticketData) {
    return await this.ticketRepository.updateTicketById(ticketId, ticketData);
  }

  async deleteTicketById(ticketId) {
    return await this.ticketRepository.deleteTicketById(ticketId);
  }

  async getTicketsByUserIdOrEmail(
    identifier,
    sort = "_id",
    page = 1,
    limit = 10
  ) {
    return await this.ticketRepository.getTicketsByUserIdOrEmail(
      identifier,
      sort,
      page,
      limit
    );
  }
}
