import { HTTPSTATUS } from "../config/http.js";
import { sanitizeRegistrationInput } from "../sanitizers/userSanitizer.js";
import removeDataBody from "../utils/removeDataBody.js";
import { validateRegistrationInput } from "../validators/userValidator.js";

export default (req, res, next) => {
  const allowedFields = ["name", "email", "password", "passwordConfirm"];
  const sanitizeBody = removeDataBody(allowedFields, req.body);
  req.body = sanitizeBody;

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
