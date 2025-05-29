import { ErrorCode } from "../config/errorCode.js";
import User from "../model/User.js";
import { UnauthorizedException } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser)
    return next(
      new UnauthorizedException(
        "User not found.",
        ErrorCode.AUTH_USER_NOT_FOUND
      )
    );

  if (currentUser.isValidToken(decoded.iat))
    return next(
      new UnauthorizedException(
        "Token is invalid or expired.",
        ErrorCode.AUTH_INVALID_TOKEN
      )
    );

  req.user = currentUser;
  next();
});
