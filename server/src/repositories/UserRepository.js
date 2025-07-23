import IRepository from "../interfaces/IRepository.js";
import User from "../models/User.js";

export default class UserRepository extends IRepository {
  constructor(database) {
    super();
    this.db = database;
    this.collection = "users";
  }

  async findById(id) {
    try {
      const userData = await User.findById(id);
      return userData;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const userData = await User.findOne({
        email,
      });
      return userData;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists.");
      }

      const userToCreate = {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await User.create(userToCreate);
      return await this.findById(result._id);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      return deletedUser;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}
