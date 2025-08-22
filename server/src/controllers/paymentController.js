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

/*
  @DEPRECATED
*/
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
  req.body.userName = req.user.name;

  // const intent = await paymentService.processPaymentIntent(req.body, "php", [
  //   { path: "event", select: "title slug" },
  // ]);
  const intent = await paymentService.processPaymentIntent(req.body, "php", [
    { path: "event", select: "title slug" },
  ]);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    intent,
  });
});

export const confirmPayment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;

  const payment = await paymentService.insertPayment(req.body, [
    { path: "event", select: "title slug" },
  ]);
  res.status(HTTPSTATUS.OK).json({ status: "success", data: payment });
});

export const getPayment = asyncHandler(async (req, res, next) => {
  const payment = await paymentService.getPayment(req.params.id);
  res.status(HTTPSTATUS.OK).json({ status: "success", data: payment });
});

export const deletePayment = asyncHandler(async (req, res, next) => {
  await paymentService.deletePayment(req.params.id);
  res.status(HTTPSTATUS.NO_CONTENT).json({ status: "success", data: null });
});

export const getAllPayments = asyncHandler(async (req, res, next) => {
  const { sort, page, limit } = req.query;
  const filter = { user: req.user._id };
  const populateOptions = req.query.populateOptions
    ? JSON.parse(req.query.populateOptions)
    : [];

  const payments = await paymentService.getAllPayments(
    sort,
    page,
    limit,
    filter,
    populateOptions
  );

  res.status(HTTPSTATUS.OK).json({ status: "success", data: payments });
});
