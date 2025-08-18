import {
  BadRequestException,
  NotFoundException,
} from "../../utils/appError.js";

export default class UserTicketService {
  constructor(userTicketRepository, ticketRepository) {
    this.userTicketRepository = userTicketRepository;
    this.ticketRepository = ticketRepository;
  }

  async getAllUserTickets(sort, page, limit, query, populateOptions) {
    return await this.userTicketRepository.getAllUserTickets(
      sort,
      page,
      limit,
      query,
      populateOptions
    );
  }

  async getUserTicket(id, populateOptions) {
    const userTicket = await this.userTicketRepository.getUserTicket(
      id,
      populateOptions
    );
    if (!userTicket) throw new NotFoundException("User ticket not found");
    return userTicket;
  }

  async updateUserTicket(id, userTicketData, populateOptions, session) {
    const existingTicket = await this.userTicketRepository.getUserTicket(id);
    if (!existingTicket) throw new NotFoundException("User ticket not found");

    const updatedTicket = await this.userTicketRepository.updateUserTicket(
      id,
      userTicketData,
      populateOptions,
      session
    );
    if (!updatedTicket) throw new NotFoundException("User ticket not found");

    return updatedTicket;
  }

  async createUserTicket(userTicketData) {
    const ticket = await this.ticketRepository.getTicket(userTicketData.ticket);
    if (!ticket) throw new NotFoundException("Ticket not found");

    if (userTicketData.quantity > ticket.availableQuantity) {
      throw new BadRequestException(
        "Requested quantity exceeds available tickets"
      );
    }

    const userTicket = await this.userTicketRepository.createUserTicket(
      userTicketData
    );
    if (!userTicket) throw new NotFoundException("User not found");

    return userTicket;
  }

  async deleteUserTicket(id, session) {
    const deletedTicket = await this.userTicketRepository.deleteUserTicket(
      id,
      session
    );
    if (!deletedTicket) throw new NotFoundException("User ticket not found");

    return deletedTicket;
  }
}
