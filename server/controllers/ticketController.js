import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Ticket from "../model/Ticket.js";
import User from "../model/User.js";
import { BadRequestException, NotFoundException } from "../utils/appError.js";
import { ErrorCode } from "../config/errorCode.js";

export const getAllTickets = asyncHandler(async (req, res) => {
  const ticket = await Ticket.find();
  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched all tickets successfully",
    data: ticket,
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

export const postTicket = asyncHandler(async (req, res) => {
  req.body.date = new Date();

  const ticket = await Ticket.create(req.body);

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
