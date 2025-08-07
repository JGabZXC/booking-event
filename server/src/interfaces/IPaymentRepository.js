export default class IPaymentRepository {
  async getAllPayments(sort = "_id", page = 1, limit = 10, filter = "") {
    throw new Error("Method 'getAllPayments' must be implemented.");
  }

  async createPayment(paymentData) {
    throw new Error("Method 'createPayment' must be implemented.");
  }

  async getPaymentById(paymentId) {
    throw new Error("Method 'getPaymentById' must be implemented.");
  }

  async getPaymentsByUser(identifier) {
    throw new Error("Method 'getPaymentsByUser' must be implemented.");
  }

  async updatePayment(paymentId, paymentData) {
    throw new Error("Method 'updatePayment' must be implemented.");
  }

  async deletePayment(paymentId) {
    throw new Error("Method 'deletePayment' must be implemented.");
  }
}
