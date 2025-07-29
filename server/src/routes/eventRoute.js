import express from "express";
import * as eventController from "../controllers/EventController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";
import imageEventMiddleware from "../middlewares/imageEventMiddleware.js";
import validateAndSanitizeEvent from "../middlewares/validateAndSanitizeEventBodyMiddleware.js";
import { uploadImages } from "../services/image/multerStorage.js";
import sanitizeSortMiddleware from "../middlewares/sanitizeSortMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(
    sanitizeSortMiddleware([
      "title",
      "place",
      "price",
      "status",
      "genre",
      "createdAt",
      "-title",
      "-place",
      "-price",
      "-status",
      "-genre",
      "-createdAt",
    ]),
    eventController.getAllEvents
  )
  .post(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    uploadImages,
    imageEventMiddleware,
    validateAndSanitizeEvent,
    eventController.createEvent
  );

router
  .route("/:identifier")
  .get(eventController.getEvent)
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.isAuthorized("admin"),
    uploadImages,
    imageEventMiddleware,
    validateAndSanitizeEvent,
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
