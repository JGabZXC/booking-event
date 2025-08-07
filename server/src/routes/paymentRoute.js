import express from "express";

import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import {
  checkoutSession,
  createPayment,
} from "../controllers/PaymentController.js";
import { validatePayment } from "../middlewares/paymentMiddleware.js";

const router = express.Router();

router.use(isAuthenticated);
router.route("/process-payment-ticket").post(checkoutSession);
router
  .route("/manual-payment")
  .post(isAuthorized("admin"), validatePayment, createPayment);

export default router;
