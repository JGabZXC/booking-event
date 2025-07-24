import IRepository from "../interfaces/IRepository.js";
import User from "../models/User.js";

export default class MongoUserRepository extends IRepository {
  async getAllUsers() {
    return await User.find();
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

  async deleteUserById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserByEmailAuth(email) {
    return await User.findOne({ email }).select("+password");
  }
}
