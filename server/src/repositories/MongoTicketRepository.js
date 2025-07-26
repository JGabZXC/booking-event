import ITicketRepository from "../interfaces/ITicketRepository.js";
import Ticket from "../models/Ticket.js";

export default class MongoTicketRepository extends ITicketRepository {
  async getAllTickets(sort = "_id", page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [tickets, totalDocs] = await Promise.all([
      Ticket.find().sort(sort).skip(skip).limit(limit),
      Ticket.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { tickets, totalDocs, totalPages };
  }

  async getTicketById(id) {
    return await Ticket.findById(id);
  }

  async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }

  async updateTicketById(ticketId, ticketData) {
    return await Ticket.findByIdAndUpdate(ticketId, ticketData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTicketById(ticketId) {
    return await Ticket.findByIdAndDelete(ticketId);
  }

  async getTicketsByUserIdOrEmail(
    identifier,
    sort = "_id",
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;
    const query = {
      $or: [{ _id: identifier }, { email: identifier }],
    };
    const [tickets, totalDocs] = await Promise.all([
      Ticket.find(query).sort(sort).skip(skip).limit(limit),
      Ticket.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { tickets, totalDocs, totalPages };
  }
}
