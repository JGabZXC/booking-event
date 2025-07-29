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

export const updateTicket = asyncHandler(async (req, res) => {
  const updatedTicket = await ticketService.updateTicket(
    req.params.id,
    req.body
  );
  return res.status(200).json({
    status: "success",
    data: updatedTicket,
  });
});

export const deleteTicket = asyncHandler(async (req, res) => {
  await ticketService.deleteTicket(req.params.id);
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.getTicket(req.params.id);
  return res.status(200).json({
    status: "success",
    data: ticket,
  });
});

export const getAllTickets = asyncHandler(async (req, res) => {
  const { sort, page, limit, ...query } = req.query;
  const tickets = await ticketService.getAllTickets(sort, page, limit, query);
  return res.status(200).json({
    status: "success",
    data: tickets,
  });
});

export const getAllTicketsByEvent = asyncHandler(async (req, res) => {
  const { sort, page, limit } = req.query;
  const tickets = await ticketService.getAllTicketsByEvent(
    sort,
    page,
    limit,
    req.params.identifier
  );
  return res.status(200).json({
    status: "success",
    data: tickets,
  });
});

export const deleteAllTicketsByEvent = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  await ticketService.deleteAllTicketsByEvent(identifier);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
