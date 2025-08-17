import IUserTicketRepository from "../interfaces/IUserTicketRepository.js";
import UserTicket from "../models/UserTicket.js";

export default class MongoUserTicketRepository extends IUserTicketRepository {
  async createUserTicket(userTicketData, session = null) {
    if (session) {
      return await UserTicket.create([userTicketData], { session });
    }
    return await UserTicket.create(userTicketData);
  }

  async getAllUserTickets(
    sort = "_id",
    page = 1,
    limit = 10,
    query = {},
    populateOptions = null
  ) {
    const skip = (page - 1) * limit;

    const [tickets, totalDocs] = await Promise.all([
      UserTicket.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populateOptions),
      UserTicket.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return { totalDocs, totalPages, tickets };
  }

  async getUserTicket(id, populateOptions = null) {
    return await UserTicket.findById(id).populate(populateOptions);
  }

  async updateUserTicket(id, userTicketData, populateOptions = null) {
    return await UserTicket.findByIdAndUpdate(id, userTicketData, {
      new: true,
      runValidators: true,
    }).populate(populateOptions);
  }

  async deleteUserTicket(id) {
    return await UserTicket.findByIdAndDelete(id);
  }
}
