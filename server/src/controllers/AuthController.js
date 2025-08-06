import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../config/cookieOption.js";
import container from "../container/container.js";

const authService = container.get("authService");

export const login = asyncHandler(async (req, res, next) => {
  const user = await authService.login(req.body);

  const options = {
    ...cookieOptions,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    maxAge: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
  };

  res.cookie("jwt", user.token, options);

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

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt");

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Logged out successfully",
  });
});

export const checkAuth = asyncHandler(async (req, res, next) => {
  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});
