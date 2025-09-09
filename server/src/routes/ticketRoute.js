import express from "express";
import {
  createTicket,
  getTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
  deleteAllTickets,
} from "../controllers/TicketController.js";
import { validateBody } from "../middlewares/ticketMiddleware.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllTickets)
  .post(isAuthenticated, isAuthorized("admin"), validateBody, createTicket)
  .delete(isAuthenticated, isAuthorized("admin"), deleteAllTickets);

router
  .route("/:id")
  .get(isAuthenticated, getTicket)
  .patch(isAuthenticated, isAuthorized("admin"), validateBody, updateTicket)
  .delete(isAuthenticated, isAuthorized("admin"), deleteTicket);

export default router;
