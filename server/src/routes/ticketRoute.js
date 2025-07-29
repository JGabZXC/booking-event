import express from "express";
import {
  createTicket,
  getTicket,
  getAllTicketsByEvent,
  getAllTickets,
  updateTicket,
  deleteTicket,
  deleteAllTicketsByEvent,
} from "../controllers/TicketController.js";
import { validateBody } from "../middlewares/ticketMiddleware.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router
  .route("/")
  .get(isAuthorized("admin"), getAllTickets)
  .post(isAuthorized("admin"), validateBody, createTicket);

router
  .route("/:id")
  .get(isAuthorized("admin"), getTicket)
  .patch(isAuthorized("admin"), validateBody, updateTicket)
  .delete(isAuthorized("admin"), deleteTicket);

router
  .route("/event/:identifier")
  .get(isAuthorized("admin"), getAllTicketsByEvent)
  .delete(isAuthorized("admin"), deleteAllTicketsByEvent);

export default router;
