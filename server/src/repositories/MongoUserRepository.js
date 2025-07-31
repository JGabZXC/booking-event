import IRepository from "../interfaces/IRepository.js";
import User from "../models/User.js";

export default class MongoUserRepository extends IRepository {
  async getAllUsers(sort = "_id", page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [users, totalDocs] = await Promise.all([
      User.find().sort(sort).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { totalDocs, totalPages, users };
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async updateUserById(userId, userData) {
    return await User.findByIdAndUpdate(userId, userData, {
      new: true,
      runValidators: true,
    });
  }

  async updateUserByEmail(email, userData) {
    return await User.findOneAndUpdate({ email }, userData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteUserById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }

  async getUserByIdAuth(userId) {
    return await User.findById(userId).select("+password");
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserByEmailAuth(email) {
    return await User.findOne({ email }).select("+password");
  }
}
