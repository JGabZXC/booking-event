import { ErrorCode } from "../config/errorCode.js";
import { HTTPSTATUS } from "../config/http.js";

export default (error) => {
  if (error.code === 11000) {
    const keys = Object.keys(error.keyValue).map((key) =>
      key.replace(" ", ",")
    );
    error.message = "Duplicate key error: " + keys;
    error.errorCode = ErrorCode.AUTH_EMAIL_ALREADY_EXISTS;
    error.statusCode = HTTPSTATUS.CONFLICT;
  }

  if (error.name === "CastError") {
    error.message = "Invalid ID format";
    error.errorCode = ErrorCode.VALIDATION_ERROR;
    error.statusCode = HTTPSTATUS.BAD_REQUEST;
  }

  if (error.name === "TokenExpiredError") {
    error.message = "Token has expired";
    error.errorCode = ErrorCode.AUTH_UNAUTHORIZED;
    error.statusCode = HTTPSTATUS.UNAUTHORIZED;
  }

  if (error.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.errorCode = ErrorCode.AUTH_INVALID_TOKEN;
    error.statusCode = HTTPSTATUS.UNAUTHORIZED;
  }

  return error;
};
