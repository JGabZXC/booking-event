import bcrypt from "bcrypt";
import * as validation from "../../utils/validation.js";

export default class PasswordService {
  constructor(saltRounds = 12) {
    this.saltRounds = saltRounds;
  }

  async hash(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async verify(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  validatePassword(data) {
    const errors = [];
    if (!data.password) errors.push("Password is required");

    if (!validation.validatePassword(data.password))
      errors.push(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );

    if (
      !validation.validatePasswordConfirm(data.password, data.passwordConfirm)
    )
      errors.push("Password and password confirmation do not match");

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
      };
    }

    return { isValid: true };
  }
}
