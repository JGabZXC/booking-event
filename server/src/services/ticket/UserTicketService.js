import { NotFoundException } from "../../utils/appError.js";

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

  async updateUserTicket(id, userTicketData, populateOptions) {
    // Get the existing user ticket
    const existingTicket = await this.userTicketRepository.getUserTicket(id);
    if (!existingTicket) throw new NotFoundException("User ticket not found");

    // Calculate the difference
    const diff = userTicketData.quantity - existingTicket.quantity;

    // Update the user ticket
    const updatedTicket = await this.userTicketRepository.updateUserTicket(
      id,
      userTicketData,
      populateOptions
    );
    if (!updatedTicket) throw new NotFoundException("User ticket not found");

    // Adjust availableQuantity only if quantity changed
    if (diff !== 0) {
      await this.ticketRepository.updateTicket(existingTicket.ticket, {
        $inc: { availableQuantity: -diff },
      });
    }

    return updatedTicket;
  }

  async createUserTicket(userTicketData) {
    const userTicket = await this.userTicketRepository.createUserTicket(
      userTicketData
    );
    if (!userTicket) throw new NotFoundException("User not found");

    await this.ticketRepository.updateTicket(userTicketData.ticket, {
      $inc: { availableQuantity: -userTicketData.quantity },
    });

    return userTicket;
  }

  async deleteUserTicket(id) {
    const deletedTicket = await this.userTicketRepository.deleteUserTicket(id);
    if (!deletedTicket) throw new NotFoundException("User ticket not found");

    await this.ticketRepository.updateTicket(deletedTicket.ticket, {
      $inc: { availableQuantity: +deletedTicket.quantity },
    });

    return deletedTicket;
  }
}
