import EmailPasswordStrategy from "../strategies/auth/EmailPasswordStrategy.js";
import TokenService from "../services/auth/TokenService.js";
import UserRepository from "../repositories/UserRepository.js";
import PasswordService from "../services/auth/PasswordService.js";
import AuthService from "../services/auth/AuthService.js";

import { HTTPSTATUS } from "../config/http.js";
import { BadRequestException } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { validateRegistrationInput } from "../validators/userValidator.js";
import { sanitizeRegistrationInput } from "../sanitizers/userSanitizer.js";

export const login = asyncHandler(async (req, res, next) => {
  return next(
    new BadRequestException("Login functionality is not implemented yet.")
  );
});

export const register = asyncHandler(async (req, res, next) => {
  const authService = new AuthService(
    new EmailPasswordStrategy(new UserRepository(), new PasswordService()),
    new TokenService(process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }),
    new UserRepository()
  );

  const { isValid, errorCode, errors } = validateRegistrationInput(req.body);

  if (!isValid) return { status: "error", errorCode, errors };

  req.body = sanitizeRegistrationInput(req.body);

  const newUser = await authService.register(req.body);

  res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    data: {
      newUser,
    },
  });
});
