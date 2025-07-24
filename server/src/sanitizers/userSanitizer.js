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

export function sanitizeReturnUserObject(user) {
  user.password = undefined;
  return user;
}
