import { ErrorCode } from "../config/errorCode.js";
import { UnauthorizedException } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import container from "../container/container.js";

const userService = container.get("userService");

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token = undefined;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (token === "null") token = null;
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new UnauthorizedException(
        "Token or cookie not found.",
        ErrorCode.AUTH_TOKEN_MISSING
      )
    );
  }

  const currentUser = await userService.validateAuthenticatedUser(token);
  req.user = currentUser;
  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new UnauthorizedException(
          "You do not have permission to perform this action.",
          ErrorCode.AUTH_UNAUTHORIZED
        )
      );

    next();
  };
};
