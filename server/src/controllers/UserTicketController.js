import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundException } from "../utils/appError.js";
import container from "../container/container.js";

const userTicketService = container.get("userTicketService");

export const getAllUserTickets = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId || req.user._id;
  const { sort, page, limit, populateOptions } = req.query;
  const userTickets = await userTicketService.getAllUserTickets(
    sort,
    page,
    limit,
    userId && { user: userId },
    populateOptions
  );

  res.status(200).json({
    status: "success",
    data: userTickets,
  });
});

export const createUserTicket = asyncHandler(async (req, res, next) => {
  const userTicket = await userTicketService.createUserTicket(req.body);

  res.status(201).json({
    status: "success",
    data: userTicket,
  });
});

export const getUserTicket = asyncHandler(async (req, res, next) => {
  let populateOptions = null;
  if (req.query.populateOptions) {
    populateOptions = JSON.parse(req.query.populateOptions);
    console.log(populateOptions);
  }

  const userTicket = await userTicketService.userTicketRepository.getUserTicket(
    req.params.userTicketId,
    populateOptions
  );

  if (!userTicket) {
    return next(new NotFoundException("User ticket not found"));
  }

  res.status(200).json({
    status: "success",
    data: userTicket,
  });
});

export const updateUserTicket = asyncHandler(async (req, res, next) => {
  const userTicket = await userTicketService.updateUserTicket(
    req.params.userTicketId,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: userTicket,
  });
});

export const deleteUserTicket = asyncHandler(async (req, res, next) => {
  await userTicketService.deleteUserTicket(req.params.userTicketId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
