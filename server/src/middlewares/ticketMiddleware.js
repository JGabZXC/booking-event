import { TicketValidator } from "../validators/ticketValidator.js";

export const validateBody = (req, res, next) => {
  const validationResult = TicketValidator.validateTicketData(
    req.body,
    req.method
  );
  if (!validationResult.isValid) {
    return res.status(400).json({
      status: "error",
      errorCode: validationResult.errorCode,
      errors: validationResult.errors,
    });
  }

  next();
};
