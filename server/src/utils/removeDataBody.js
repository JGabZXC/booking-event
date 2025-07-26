export default function (allowedFields, body) {
  const sanitizeBody = {};
  allowedFields.forEach((field) => {
    if (Object.keys(body).includes(field)) {
      sanitizeBody[field] = body[field];
    }
  });
  return sanitizeBody;
}
