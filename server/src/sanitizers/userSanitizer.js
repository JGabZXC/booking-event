import { capitalizedFirstLetter } from "../utils/capitalizeName.js";

export function sanitizeRegistrationInput(data) {
  return {
    name: capitalizedFirstLetter(data.name),
    email: data.email.trim(),
    password: data.password.trim(),
    passwordConfirm: data.passwordConfirm.trim(),
  };
}
