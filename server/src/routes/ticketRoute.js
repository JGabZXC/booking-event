import express from "express";
import * as ticketController from "../controllers/ticketController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(ticketController.getAllTickets)
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    ticketController.postTicket
  );

router
  .route("/:id")
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
