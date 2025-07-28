import express from "express";
import * as eventController from "../controllers/EventController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import imageEventMiddleware from "../middlewares/imageEventMiddleware.js";
import validateAndSanitizeTicket from "../middlewares/validateAndSanitizeEventBodyMiddleware.js";
import { uploadImages } from "../services/image/multerStorage.js";
const router = express.Router();

router
  .route("/")
  .get(eventController.getAllEvents)
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    uploadImages,
    imageEventMiddleware,
    validateAndSanitizeTicket,
    eventController.createEvent
  );

router
  .route("/:identifier")
  .get(eventController.getEvent)
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    eventController.updateEvent
  )
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    eventController.deleteEvent
  );

router
  .route("/:id/purchase")
  .post(authMiddleware.isAuthenticated, eventController.purchaseEvent);
export default router;
