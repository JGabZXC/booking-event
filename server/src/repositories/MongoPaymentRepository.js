import IPaymentRepository from "../interfaces/IPaymentRepository.js";
import Payment from "../models/Payment.js";

export default class MongoPaymentRepository extends IPaymentRepository {
  async createPayment(paymentData, session) {
    if (session) {
      return await Payment.create([paymentData], { session });
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

  async getAllPayments(
    sort = "_id",
    page = 1,
    limit = 10,
    filter = {},
    populateOptions = null
  ) {
    const skip = (page - 1) * limit;
    const [payments, totalDocs] = await Promise.all([
      Payment.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populateOptions),
      Payment.countDocuments(filter),
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
