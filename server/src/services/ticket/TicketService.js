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

    // Create the ticket
    return await this.ticketRepository.createTicket(ticketData);
  }

  async getTicket(id) {
    const ticket = await this.ticketRepository.getTicket(id);
    if (!ticket) throw new NotFoundException("Ticket not found");
    return ticket;
  }

  async updateTicket(id, ticketData) {
    const ticket = await this.ticketRepository.getTicket(id);
    if (!ticket) throw new NotFoundException("Ticket not found");

    return await this.ticketRepository.updateTicket(id, ticketData);
  }

  async deleteTicket(id) {
    const ticket = await this.ticketRepository.getTicket(id);
    if (!ticket) throw new NotFoundException("Ticket not found");
    return await this.ticketRepository.deleteTicket(id);
  }

  async getAllTickets(sort = "_id", page = 1, limit = 10, query = {}) {
    return await this.ticketRepository.getAllTickets(sort, page, limit, query);
  }

  async getAllTicketsByEvent(sort, page, limit, identifier) {
    const event = await this.eventRepository.getEvent(identifier);
    if (!event) throw new NotFoundException("Event not found");

    return await this.getAllTickets(sort, page, limit, {
      event: event._id,
    });
  }

  async deleteAllTicketsByEvent(identifier) {
    const event = await this.eventRepository.getEvent(identifier);
    if (!event) throw new NotFoundException("Event not found");

    // Delete all tickets associated with the event
    return await this.ticketRepository.deleteAllTicketsByEvent(event._id);
  }
}
