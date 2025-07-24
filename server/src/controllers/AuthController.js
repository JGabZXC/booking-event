import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import container from "../container/container.js";

const authService = container.get("authService");

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

export const logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt");

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Logged out successfully",
  });
});
