import IRepository from "../interfaces/IRepository.js";
import User from "../models/User.js";
import { validateEmail } from "../utils/validation.js";

export default class MongoUserRepository extends IRepository {
  async getAllUsers(sort = "_id", page = 1, limit = 10, options = {}) {
    const skip = (page - 1) * limit;

    const [users, totalDocs] = await Promise.all([
      User.find(options?.filter || {})
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(options?.filter || {}),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { totalDocs, totalPages, users };
  }

  async getUser(identifier, options = {}) {
    const isEmail = validateEmail(identifier);

    if (isEmail) {
      return await User.findOne({ email: identifier }).select(options.select);
    }

    return await User.findById(identifier).select(options.select);
  }

  async createUser(userData, session = null) {
    if (session) {
      return await User.create([userData], { session });
    }
    return await User.create(userData);
  }

  async updateUser(identifier, userData) {
    const isEmail = validateEmail(identifier);

    if (isEmail)
      return await User.findOneAndUpdate({ email: identifier }, userData, {
        new: true,
        runValidators: true,
      });

    return await User.findByIdAndUpdate(identifier, userData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteUser(identifier) {
    const isEmail = validateEmail(identifier);

    if (isEmail) return await User.findOneAndDelete({ email: identifier });

    return await User.findByIdAndDelete(identifier);
  }
}
