import {
  TicketValidator,
  UserTicketValidator,
} from "../validators/ticketValidator.js";

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

export const userTicketValidateBody = (req, res, next) => {
  const validationResult = UserTicketValidator.validateUserTicketData(req.body);
  if (!validationResult.isValid) {
    return res.status(400).json({
      status: "error",
      errorCode: validationResult.errorCode,
      errors: validationResult.errors,
    });
  }

  req.body.user = req.user._id;
  if (req.body.purchasedDate) delete req.body.purchasedDate;
  next();
};
