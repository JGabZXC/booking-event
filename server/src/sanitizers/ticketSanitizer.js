import removeDataBody from "../utils/removeDataBody.js";

export function sanitizeBody(data) {
  const allowedFields = [
    "title",
    "description",
    "coverImage",
    "images",
    "organizers",
    "date",
    "place",
    "price",
    "status",
    "genre",
  ];

  return removeDataBody(allowedFields, data);
}
