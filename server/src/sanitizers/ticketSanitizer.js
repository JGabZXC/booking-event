import removeDataBody from "../utils/removeDataBody.js";

export function sanitizeBody(data) {
  const allowedFields = [
    "title",
    "description",
    "coverImage",
    "images",
    "organizer",
    "date",
    "place",
    "price",
    "status",
    "genre",
  ];

  return removeDataBody(allowedFields, data);
}
