import { bodyValidator } from "../validators/ticketValidator.js";
import { sanitizeBody } from "../sanitizers/ticketSanitizer.js";
import { HTTPSTATUS } from "../config/http.js";

export default (req, res, next) => {
  if (req.body.organizers && !Array.isArray(req.body.organizers)) {
    req.body.organizers = [req.body.organizers];
  }
  const { isValid, errorCode, errors } = bodyValidator(
    req.body,
    req.files?.coverImage[0]
  );

  if (!isValid)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      status: "error",
      errorCode,
      errors,
    });

  req.body = sanitizeBody(req.body);

  next();
};
