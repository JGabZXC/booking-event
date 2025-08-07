import { asyncHandler } from "../utils/asyncHandler.js";
import container from "../container/container.js";

const paymentService = container.get("paymentService");

export const createPayment = asyncHandler(async (req, res, next) => {
  req.body.user = String(req.user._id);
  req.body.userEmail = req.user.email;

  const paymentRecord = await paymentService.createPayment(req.body);
  res.status(201).json({ paymentRecord });
});

export const checkoutSession = asyncHandler(async (req, res, next) => {
  req.body.user = String(req.user._id);
  req.body.userEmail = req.user.email;

  const session = await paymentService.processPayment(req.body, "php", [
    { path: "event", select: "title slug" },
  ]);
  res.status(200).json({ session });
});
