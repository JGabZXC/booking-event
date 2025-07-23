import { ErrorCode } from "../config/errorCode.js";

export function validateRegistrationInput(data) {
  const errors = [];

  if (!data.name) errors.push("Name is required.");
  if (!data.email) errors.push("Email is required.");
  if (!data.password) errors.push("Password is required.");
  if (data.password && data.password.length < 8)
    errors.push("Password must be at least 8 characters long.");
  if (!data.passwordConfirm) errors.push("Confirm Password is required.");
  if (data.passwordConfirm && data.passwordConfirm.length < 8)
    errors.push("Confirm Password must be at least 8 characters long.");
  if (data.password !== data.passwordConfirm)
    errors.push("Passwords do not match.");

  if (errors.length > 0)
    return {
      isValid: false,
      errorCode: ErrorCode.VALIDATION_ERROR,
      errors,
    };

  return { isValid: true };
}
