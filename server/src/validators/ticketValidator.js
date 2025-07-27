import { ErrorCode } from "../config/errorCode.js";

export function bodyValidator(data, coverImage) {
  const errors = [];
  if (!data.title) errors.push("Title is required.");
  if (!data.description) errors.push("Description is required.");
  // if (!coverImage) errors.push("Cover image is required.");

  if (
    !data.organizers ||
    !Array.isArray(data.organizers) ||
    data.organizers.length === 0
  ) {
    errors.push("At least one organizer is required.");
  }

  if (!data.place) errors.push("Place is required.");
  if (!data.price) errors.push("Price is required.");
  if (!data.genre) errors.push("Genre is required.");

  if (errors.length > 0)
    return {
      isValid: false,
      errorCode: ErrorCode.VALIDATION_ERROR,
      errors,
    };

  return { isValid: true };
}
