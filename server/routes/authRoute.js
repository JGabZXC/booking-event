import express from "express";
import * as authController from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.register);
router.route("/test").get(isAuthenticated, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Authenticated successfully",
    user: req.user,
  });
});
export default router;
