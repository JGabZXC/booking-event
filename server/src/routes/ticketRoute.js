import express from "express";
import { createTicket } from "../controllers/TicketController.js";
import { validateBody } from "../middlewares/ticketMiddleware.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.route("/").post(isAuthorized("admin"), validateBody, createTicket);

export default router;
