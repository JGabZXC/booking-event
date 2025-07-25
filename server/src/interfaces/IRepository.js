export default class IRepository {
  async getAllUsers() {
    throw new Error("Method not implemented");
  }

  async createUser(userData) {
    throw new Error("Method not implemented");
  }

  async updateUserById(userId, userData) {
    throw new Error("Method not implemented");
  }

  async updateUserByEmail(email, userData) {
    throw new Error("Method not implemented");
  }

  async deleteUserById(userId) {
    throw new Error("Method not implemented");
  }

  async getUserById(userId) {
    throw new Error("Method not implemented");
  }

  async getUserByIdAuth(userId) {
    throw new Error("Method not implemented");
  }

  async getUserByEmail(email) {
    throw new Error("Method not implemented");
  }

  async getUserByEmailAuth(email) {
    throw new Error("Method not implemented");
  }
}
