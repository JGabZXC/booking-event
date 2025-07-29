import express from "express";
import * as userController from "../controllers/userController.js";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddleware.js";
import sanitizeUserDetailsMiddleware from "../middlewares/sanitizeUserDetailsMiddleware.js";
import sanitizeSortMiddleware from "../middlewares/sanitizeSortMiddleware.js";
const router = express.Router();

router.use(isAuthenticated);

router
  .route("/")
  .get(
    isAuthorized("admin"),
    sanitizeSortMiddleware([
      "name",
      "role",
      "email",
      "-name",
      "-role",
      "-email",
    ]),
    userController.getAllUsers
  );
router
  .route("/:identifier")
  .get(isAuthorized("admin"), userController.getUser)
  .patch(
    isAuthorized("admin"),
    sanitizeUserDetailsMiddleware,
    userController.updateUserAdmin
  );
router
  .route("/:identifier/password")
  .patch(isAuthorized("admin"), userController.updateUserPasswordAdmin);

router.route("/update/password").patch(userController.updatePassword);
router
  .route("/update/me")
  .patch(sanitizeUserDetailsMiddleware, userController.updateMe);

export default router;
