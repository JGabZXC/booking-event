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
}
