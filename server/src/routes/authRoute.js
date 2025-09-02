import express from "express";
import {
  checkAuth,
  login,
  logout,
  register,
} from "../controllers/AuthController.js";
import validationRegistrationMiddleware from "../middlewares/validationRegistrationMiddleware.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(validationRegistrationMiddleware, register);
router
  .route("/register/admin")
  .post(isAuthenticated, isAuthorized("admin"), register);
router.route("/logout").post(isAuthenticated, logout);
router.route("/check").get(isAuthenticated, checkAuth);
export default router;
