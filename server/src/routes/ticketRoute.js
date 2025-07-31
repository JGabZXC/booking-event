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

router.use(isAuthenticated);

router
  .route("/")
  .get(isAuthorized("admin"), getAllTickets)
  .post(isAuthorized("admin"), validateBody, createTicket)
  .delete(isAuthorized("admin"), deleteAllTickets);

router
  .route("/:id")
  .get(isAuthorized("admin"), getTicket)
  .patch(isAuthorized("admin"), validateBody, updateTicket)
  .delete(isAuthorized("admin"), deleteTicket);

export default router;
