export default function (dataIncluded, body) {
  const sanitizeBody = {};
  for (const key of dataIncluded) {
    if (body.hasOwnProperty(key)) {
      sanitizeBody[key] = body[key];
    }
  }
  return sanitizeBody;
}
