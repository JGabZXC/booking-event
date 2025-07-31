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

  /*
   TODO:
    Refactor the logic to handle ticket availability and quantity checks
  */
  async updateUserTicket(id, userTicketData, populateOptions) {
    const existingTicket = await this.userTicketRepository.getUserTicket(id);
    if (!existingTicket) throw new NotFoundException("User ticket not found");

    const isTicketChanged =
      userTicketData.ticket &&
      userTicketData.ticket.toString() !== existingTicket.ticket.toString();

    let ticketToCheck, availableQuantity;
    if (isTicketChanged) {
      ticketToCheck = await this.ticketRepository.getTicket(
        userTicketData.ticket
      );
      availableQuantity = ticketToCheck.availableQuantity;
      if (userTicketData.quantity > availableQuantity) {
        throw new BadRequestException(
          "Requested quantity exceeds available tickets"
        );
      }
    } else {
      ticketToCheck = await this.ticketRepository.getTicket(
        existingTicket.ticket
      );
      availableQuantity =
        ticketToCheck.availableQuantity + existingTicket.quantity;
      if (userTicketData.quantity > availableQuantity) {
        throw new BadRequestException(
          "Requested quantity exceeds available tickets"
        );
      }
    }

    const updatedTicket = await this.userTicketRepository.updateUserTicket(
      id,
      userTicketData,
      populateOptions
    );
    if (!updatedTicket) throw new NotFoundException("User ticket not found");

    if (isTicketChanged) {
      await this.ticketRepository.updateTicket(existingTicket.ticket, {
        $inc: { availableQuantity: existingTicket.quantity },
      });
      await this.ticketRepository.updateTicket(userTicketData.ticket, {
        $inc: { availableQuantity: -userTicketData.quantity },
      });
    } else {
      const diff = userTicketData.quantity - existingTicket.quantity;
      if (diff !== 0) {
        await this.ticketRepository.updateTicket(existingTicket.ticket, {
          $inc: { availableQuantity: -diff },
        });
      }
    }

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
