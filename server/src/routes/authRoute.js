import express from "express";
import { login, register } from "../controllers/AuthController.js";
import validationRegistrationMiddleware from "../middlewares/validationRegistrationMiddleware.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(validationRegistrationMiddleware, register);
export default router;
