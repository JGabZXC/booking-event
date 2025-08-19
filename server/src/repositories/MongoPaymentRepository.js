import IPaymentRepository from "../interfaces/IPaymentRepository.js";
import Payment from "../models/Payment.js";

export default class MongoPaymentRepository extends IPaymentRepository {
  async createPayment(paymentData, session) {
    if (session) {
      const payment = await Payment.create([paymentData], { session });
      return payment;
    }

    return await Payment.create(paymentData);
  }

  async updatePayment(paymentId, paymentData) {
    return await Payment.findByIdAndUpdate(paymentId, paymentData, {
      new: true,
      runValidators: true,
    });
  }

  async getPaymentById(paymentId) {
    return await Payment.findById(paymentId);
  }

  async getPaymentByIntent(intentId) {
    return await Payment.findOne({
      paymentIntentId: intentId,
    });
  }

  async geAllPayments(sort = "_id", page = 1, limit = 10, filter = "") {
    const skip = (page - 1) * limit;
    const filterType = filter === "all" ? {} : { status: filter };
    const [payments, totalDocs] = await Promise.all([
      Payment.find(filterType).sort(sort).skip(skip).limit(limit),
      Payment.countDocuments(filterType),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { payments, totalDocs, totalPages };
  }

  async getPaymentsByUser(identifier) {
    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { userId: identifier }
      : { userEmail: identifier };
    return await Payment.find(query);
  }

  async deletePayment(paymentId) {
    return await Payment.findByIdAndDelete(paymentId);
  }
}
