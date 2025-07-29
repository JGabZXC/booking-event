import { asyncHandler } from "../utils/asyncHandler.js";
import container from "../container/container.js";

const ticketService = container.get("ticketService");

export const createTicket = asyncHandler(async (req, res) => {
  const newTicket = await ticketService.createTicket(req.body);

  return res.status(201).json({
    status: "success",
    data: newTicket,
  });
});

export const getTicket = asyncHandler(async (req, res) => {
  throw new Error("Not implemented yet");
});
