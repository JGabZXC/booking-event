import express from "express";
import {
  createUserTicket,
  getAllUserTickets,
  getUserTicket,
  updateUserTicket,
  deleteUserTicket,
} from "../controllers/UserTicketController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { userTicketValidateBody } from "../middlewares/ticketMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(isAuthenticated);

router
  .route("/")
  .get(getAllUserTickets)
  .post(userTicketValidateBody, createUserTicket);

router
  .route("/:userTicketId")
  .get(getUserTicket)
  .patch(updateUserTicket)
  .delete(deleteUserTicket);

export default router;
