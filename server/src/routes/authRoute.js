import express from "express";
import { login, logout, register } from "../controllers/AuthController.js";
import validationRegistrationMiddleware from "../middlewares/validationRegistrationMiddleware.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(validationRegistrationMiddleware, register);
router.route("/logout").post(isAuthenticated, logout);
export default router;
