import express from "express";
import * as ticketController from "../controllers/ticketController.js";

const router = express.Router();

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(ticketController.postTicket);

router.route("/:id").delete(ticketController.deleteTicket);
export default router;
