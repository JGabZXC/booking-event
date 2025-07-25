import removeDataBody from "../utils/removeDataBody.js";

export default (req, res, next) => {
  const allowedFields = ["name", "email"];
  if (req.body.role && req.user.role === "admin") allowedFields.push("role");

  const sanitizedBody = removeDataBody(allowedFields, req.body);
  req.body = sanitizedBody;

  next();
};
