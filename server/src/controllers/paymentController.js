import { asyncHandler } from "../utils/asyncHandler.js";
import container from "../container/container.js";
import { HTTPSTATUS } from "../config/http.js";

const paymentService = container.get("paymentService");

export const createPayment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.userEmail = req.user.email;

  const paymentRecord = await paymentService.createPayment(req.body);
  res
    .status(HTTPSTATUS.CREATED)
    .json({ status: "success", data: paymentRecord });
});

export const checkoutSession = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.userEmail = req.user.email;

  const session = await paymentService.processPayment(req.body, "php", [
    { path: "event", select: "title slug" },
  ]);
  res.status(HTTPSTATUS.OK).json({
    status: "success",
    session,
  });
});

export const checkoutIntent = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.userEmail = req.user.email;

  const intent = await paymentService.processPaymentIntent(req.body, "php", [
    { path: "event", select: "title slug" },
  ]);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    intent,
  });
});

export const getPayment = asyncHandler(async (req, res, next) => {
  const payment = await paymentService.getPayment(req.params.id);
  res.status(HTTPSTATUS.OK).json({ status: "success", data: payment });
});

export const deletePayment = asyncHandler(async (req, res, next) => {
  await paymentService.deletePayment(req.params.id);
  res.status(HTTPSTATUS.NO_CONTENT).json({ status: "success", data: null });
});
