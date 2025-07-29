export default class UserTicketService {
  constructor(userTicketRepository, ticketRepository) {
    this.userTicketRepository = userTicketRepository;
    this.ticketRepository = ticketRepository;
  }

  async createUserTicket(userTicketData) {}
}
