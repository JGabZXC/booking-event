import EmailPasswordStrategy from "../strategies/auth/EmailPasswordStrategy.js";
import TokenService from "../services/auth/TokenService.js";
import PasswordService from "../services/auth/PasswordService.js";
import AuthService from "../services/auth/AuthService.js";
import MongoUserRepository from "../repositories/MongoUserRepository.js";

import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authService = new AuthService(
  new EmailPasswordStrategy(
    new MongoUserRepository(),
    new PasswordService(),
    new TokenService()
  )
);

export const login = asyncHandler(async (req, res, next) => {
  const user = await authService.login(req.body);

  res.cookie("jwt", user.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  });

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: user,
  });
});

export const register = asyncHandler(async (req, res, next) => {
  const newUser = await authService.register(req.body);

  res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    data: {
      newUser,
    },
  });
});
