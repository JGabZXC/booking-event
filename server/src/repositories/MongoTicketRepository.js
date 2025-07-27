import mongoose from "mongoose";
import ITicketRepository from "../interfaces/ITicketRepository.js";
import Ticket from "../models/Ticket.js";
import { NotFoundException } from "../utils/appError.js";

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

  async getTicket(identifier) {
    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    const ticket = await Ticket.findOne(query);

    if (!ticket)
      throw new NotFoundException(
        "No ticket found with the provided identifier"
      );

    return ticket;
  }

  async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }

  async updateTicket(identifier, ticketData) {
    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    return await Ticket.findOneAndUpdate(query, ticketData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteTicket(identifier) {
    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }
    return await Ticket.findOneAndDelete(query);
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
