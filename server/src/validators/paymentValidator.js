import { ErrorCode } from "../config/errorCode.js";

export default class PaymentValidator {
  static validatePaymentData(paymentData) {
    const errors = [];
    if (!paymentData.user) errors.push("User is required.");
    if (!paymentData.amount) errors.push("Amount is required.");
    if (!paymentData.paymentMethod) errors.push("Payment method is required.");
    if (!paymentData.officialReceipt)
      errors.push("Official receipt is required.");
    if (paymentData.ticketSelections.length === 0)
      errors.push("At least one ticket is required.");

    if (errors.length > 0) {
      return { isValid: false, errorCode: ErrorCode.VALIDATION_ERROR, errors };
    }
    return { isValid: true };
  }
}
