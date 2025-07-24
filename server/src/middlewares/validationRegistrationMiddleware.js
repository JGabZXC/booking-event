import { HTTPSTATUS } from "../config/http.js";
import { sanitizeRegistrationInput } from "../sanitizers/userSanitizer.js";
import { validateRegistrationInput } from "../validators/userValidator.js";

export default (req, res, next) => {
  const { role } = req.body;
  if (role) delete req.body.role; // Remove role from request body if it exists

  const validator = validateRegistrationInput(req.body);

  if (!validator.isValid) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      status: "error",
      errorCode: validator.errorCode,
      errors: validator.errors,
    });
  }

  req.body = sanitizeRegistrationInput(req.body);

  next();
};
