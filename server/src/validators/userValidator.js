import { ErrorCode } from "../config/errorCode.js";
import * as validation from "../utils/validation.js";

export function validateRegistrationInput(data) {
  const errors = [];

  if (!data.name) {
    errors.push("Name is required");
  } else if (!validation.validateFullName(data.name)) {
    errors.push("Name must contain only letters");
  }

  if (!data.email) {
    errors.push("Email is required");
  } else if (!validation.validateEmail(data.email)) {
    errors.push("Email is not valid");
  }

  if (!data.password) {
    errors.push("Password is required");
  } else if (!validation.validatePassword(data.password)) {
    errors.push(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }

  if (!data.passwordConfirm) {
    errors.push("Confirm Password is required");
  } else if (
    !validation.validatePasswordConfirm(data.password, data.passwordConfirm)
  ) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0)
    return {
      isValid: false,
      errorCode: ErrorCode.VALIDATION_ERROR,
      errors,
    };

  return { isValid: true };
}
