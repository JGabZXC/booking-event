import { capitalizeFullName } from "../utils/capitalizeName.js";

export function sanitizeRegistrationInput(data) {
  return {
    ...data,
    name: capitalizeFullName(data.name),
    email: data.email.trim(),
    password: data.password.trim(),
    passwordConfirm: data.passwordConfirm.trim(),
  };
}

export function sanitizeReturnUserObject(user, notAllowedFields) {
  if (!user) return null;
  if (notAllowedFields) {
    notAllowedFields.forEach((field) => {
      user[field] = undefined;
    });
  }
  return user;
}
