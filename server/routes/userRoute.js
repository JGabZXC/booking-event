import express from "express";
import * as userController from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.use(isAuthenticated);
router.route("/update/password").patch(userController.updatePassword);
router.route("/update/me").patch(userController.updateMe);
export default router;
