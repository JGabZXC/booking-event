import { NotFoundException } from "../../utils/appError.js";

export default class TicketService {
  constructor(ticketRepository, eventRepository) {
    this.ticketRepository = ticketRepository;
    this.eventRepository = eventRepository;
  }

  async createTicket(ticketData) {
    const event = await this.eventRepository.getEvent(ticketData.event);
    if (!event) throw new NotFoundException("Event not found");

    // createTicket method expects ticketData.event to be an ObjectId
    ticketData.event = event._id;

    return await this.ticketRepository.createTicket(ticketData);
  }

  async getTicket(id, populateOptions = null) {
    const ticket = await this.ticketRepository.getTicket(id, populateOptions);
    if (!ticket) throw new NotFoundException("Ticket not found");
    return ticket;
  }

  async updateTicket(id, ticketData) {
    const updatedTicket = await this.ticketRepository.updateTicket(
      id,
      ticketData
    );
    if (!updatedTicket) throw new NotFoundException("Ticket not found");

    return updatedTicket;
  }

  async deleteTicket(id) {
    const ticket = await this.ticketRepository.deleteTicket(id);
    if (!ticket) throw new NotFoundException("Ticket not found");
    return ticket;
  }

  async getAllTickets(sort = "_id", page = 1, limit = 10, query = {}) {
    return await this.ticketRepository.getAllTickets(sort, page, limit, query);
  }

  async deleteAllTickets(query = {}) {
    return await this.ticketRepository.deleteAllTickets(query);
  }
}
