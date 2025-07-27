import express from "express";
import * as ticketController from "../controllers/TicketController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import validateAndSanitizeTicket from "../middlewares/validateAndSanitizeTicketBodyMiddleware.js";
import imageTicketMiddleware from "../middlewares/imageTicketMiddleware.js";
import { uploadImages } from "../services/image/multerStorage.js";
const router = express.Router();

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    uploadImages,
    imageTicketMiddleware,
    validateAndSanitizeTicket,
    ticketController.createTicket
  );

router
  .route("/:identifier")
  .get(ticketController.getTicket)
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    ticketController.updateTicket
  )
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    ticketController.deleteTicket
  );

router
  .route("/:id/purchase")
  .post(authMiddleware.isAuthenticated, ticketController.purchaseTicket);
export default router;
