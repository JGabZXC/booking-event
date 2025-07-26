import { HTTPSTATUS } from "../config/http.js";
import { ErrorCode } from "../config/errorCode.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import QueryOptions from "../utils/queryOptions.js";
import { BadRequestException, NotFoundException } from "../utils/appError.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

import container from "../container/container.js";

const ticketRepository = container.get("ticketRepository");

export const getAllTickets = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  if (page && limit)
    if (Number.isNaN(+page) || Number.isNaN(+limit) || +page < 1 || +limit < 1)
      return next(
        new BadRequestException(
          "Page and limit must be positive integers.",
          ErrorCode.VALIDATION_ERROR
        )
      );

  const query = new QueryOptions(Ticket.find(), req.query).sort().paginate();

  const [tickets, totalTickets] = await Promise.all([
    query.query,
    Ticket.countDocuments(),
  ]);
  const totalPages = Math.ceil(totalTickets / (req.query.limit || 10));

  if (page && page > totalPages)
    return next(
      new BadRequestException(
        `Page number exceeds total pages. Total pages: ${totalPages}`,
        ErrorCode.VALIDATION_ERROR
      )
    );

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched all tickets successfully",
    totalTickets,
    totalPages,
    data: tickets,
  });
});

export const getTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);
  if (!ticket)
    return new NotFoundException(
      "No ticket was found with the provided ID",
      ErrorCode.RESOURCE_NOT_FOUND
    );

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched ticket successfully",
    data: ticket,
  });
});

export const createTicket = asyncHandler(async (req, res) => {
  req.body.date = new Date();

  const ticket = await ticketRepository.createTicket(req.body);

  res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    message: "Ticket created successfully",
    data: ticket,
  });
});

export const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body.attendees)
    return new BadRequestException(
      "Attendees cannot be updated directly.",
      ErrorCode.VALIDATION_ERROR
    );

  const ticket = await Ticket.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Ticket updated successfully",
    data: ticket,
  });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndDelete(id);

  if (!ticket)
    return new NotFoundException(
      "No ticket was found with the provided ID",
      ErrorCode.RESOURCE_NOT_FOUND
    );

  res.status(HTTPSTATUS.NO_CONTENT).json({
    status: "success",
    message: "Ticket deleted successfully",
    data: null,
  });
});

export const purchaseTicket = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.user._id);
  const ticket = await Ticket.findById(id);

  if (!ticket)
    return next(
      new NotFoundException(
        "No ticket was found with the provided ID",
        ErrorCode.RESOURCE_NOT_FOUND
      )
    );

  if (ticket.status !== "in-progress")
    return next(
      new BadRequestException(
        "Ticket is not available for purchase",
        ErrorCode.VALIDATION_ERROR
      )
    );

  if (ticket.attendees.includes(req.user._id))
    return next(
      new BadRequestException(
        "You have already purchased this ticket",
        ErrorCode.VALIDATION_ERROR
      )
    );

  ticket.attendees.push(req.user._id);
  user.ticketsPurchased.push(ticket._id);

  const [updatedTicket] = await Promise.all([
    ticket.save({ validateModifiedOnly: true }),
    user.save({ validateModifiedOnly: true }),
  ]);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Ticket purchased successfully",
    data: updatedTicket,
  });
});
