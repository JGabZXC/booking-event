import { promisify } from "util";
import jwt from "jsonwebtoken";
import { ErrorCode } from "../config/errorCode.js";
import { UnauthorizedException } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/User.js";

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

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      return next(
        new UnauthorizedException(
          "User not found.",
          ErrorCode.AUTH_USER_NOT_FOUND
        )
      );

    if (currentUser.isPasswordChangedAfter(decoded.iat))
      return next(
        new UnauthorizedException(
          "Password has been changed. Please log in again.",
          ErrorCode.AUTH_PASSWORD_CHANGED
        )
      );

    if (currentUser.isValidToken(decoded.iat))
      return next(
        new UnauthorizedException(
          "This token is no longer valid, please log in again.",
          ErrorCode.AUTH_INVALID_TOKEN
        )
      );

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new UnauthorizedException(
          "Token has expired. Please log in again.",
          ErrorCode.AUTH_TOKEN_EXPIRED
        )
      );
    } else {
      return next(
        new UnauthorizedException(
          "Invalid token. Please log in again.",
          ErrorCode.AUTH_INVALID_TOKEN
        )
      );
    }
  }
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
