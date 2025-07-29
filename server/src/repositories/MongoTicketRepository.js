import ITicketRepository from "../interfaces/ITicketRepository.js";
import Ticket from "../models/Ticket.js";

export default class MongoTicketRepository extends ITicketRepository {
  async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getTicket(id) {
    return await Ticket.findById(id);
  }

  async getAllTickets(sort = "_id", page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [tickets, totalDocs] = await Promise.all([
      Ticket.find().sort(sort).skip(skip).limit(limit),
      Ticket.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { tickets, totalDocs, totalPages };
  }

  async updateTicket(id, ticketData) {
    return await Ticket.findByIdAndUpdate(id, ticketData);
  }

  async deleteTicket(id) {
    return await Ticket.findByIdAndDelete(id);
  }
}
