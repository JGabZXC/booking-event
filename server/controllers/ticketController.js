import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Ticket from "../model/Ticket.js";
import { BadRequestException } from "../utils/appError.js";
import { ErrorCode } from "../config/errorCode.js";

export const getAllTickets = asyncHandler(async (req, res) => {
  const response = await Ticket.find();
  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched all tickets successfully",
    data: response,
  });
});

export const postTicket = asyncHandler(async (req, res) => {
  req.body.date = new Date();
  console.log(req.body);
  const response = await Ticket.create(req.body);

  res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    message: "Ticket created successfully",
    data: response,
  });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Ticket.findByIdAndDelete(id);

  if (!response)
    return new BadRequestException(
      "No ticket was found with the provided ID",
      ErrorCode.RESOURCE_NOT_FOUND
    );

  res.status(HTTPSTATUS.NO_CONTENT).json({
    status: "success",
    message: "Ticket deleted successfully",
    data: null,
  });
});
