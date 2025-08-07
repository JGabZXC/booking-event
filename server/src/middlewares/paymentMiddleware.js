import { HTTPSTATUS } from "../config/http.js";
import PaymentValidator from "../validators/paymentValidator.js";

export const validatePayment = (req, res, next) => {
  const { isValid } = PaymentValidator.validatePaymentData(req.body);
  if (!isValid) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      error: "Validation Error",
      details: PaymentValidator.validatePaymentData(req.body).errors,
    });
  }

  next();
};
