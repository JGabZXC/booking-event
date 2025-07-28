import { bodyValidator } from "../validators/ticketValidator.js";
import { sanitizeBody } from "../sanitizers/ticketSanitizer.js";
import { HTTPSTATUS } from "../config/http.js";
import slugify from "slugify";

export default (req, res, next) => {
  if (req.body.organizers && !Array.isArray(req.body.organizers)) {
    req.body.organizers = [req.body.organizers];
  }

  const { isValid, errorCode, errors } = bodyValidator(
    req.body,
    req.files?.coverImage && req.files.coverImage[0]
  );

  if (!isValid)
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      status: "error",
      errorCode,
      errors,
    });

  req.body = sanitizeBody(req.body);

  req.body.slug = slugify(req.body.title, {
    lower: true,
    trim: true,
    replacement: "-",
  });

  req.body.coverImage = {};
  req.body.coverImage.fileName = "unset";
  req.body.coverImage.url = "unset";
  req.body.coverImage.urlExpires = new Date("1970-01-01");
  req.body.images = [];

  next();
};
