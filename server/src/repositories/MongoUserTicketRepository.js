import IUserTicketRepository from "../interfaces/IUserTicketRepository.js";
import UserTicket from "../models/UserTicket.js";

export default class MongoUserTicketRepository extends IUserTicketRepository {
  async createUserTicket(userTicketData) {
    return await UserTicket.create(userTicketData);
  }

  async getUserTicket(id) {
    return await UserTicket.findById(id).populate("user ticket");
  }

  async getAllUserTickets() {
    return await UserTicket.find().populate("user ticket");
  }

  async updateUserTicket(id, userTicketData) {
    return await UserTicket.findByIdAndUpdate(id, userTicketData, {
      new: true,
    });
  }

  async deleteUserTicket(id) {
    return await UserTicket.findByIdAndDelete(id);
  }
}
