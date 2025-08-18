import express from "express";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  checkoutIntent,
  checkoutSession,
  createPayment,
  deletePayment,
  getPayment,
  confirmPayment,
} from "../controllers/PaymentController.js";
import { validatePayment } from "../middlewares/paymentMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.route("/process-payment-ticket").post(checkoutSession);
router.route("/process-payment-intent").post(checkoutIntent);
router.route("/confirm-payment").post(confirmPayment);
router
  .route("/manual-payment")
  .post(isAuthorized("admin"), validatePayment, createPayment);

router
  .route("/:id")
  .get(isAuthorized("admin"), getPayment)
  .delete(isAuthorized("admin"), deletePayment);

export default router;
