import { ErrorCode } from "../config/errorCode.js";
import { HTTPSTATUS } from "../config/http.js";

export const errorHandler = (error, req, res, next) => {
  // console.error("ERROR ON PATH: ", req.path, error);

  if (error.name === "CastError")
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      status: "fail",
      errorCode: ErrorCode.VALIDATION_ERROR,
      message: "Invalid ID format",
    });

  return res.status(error.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    status: "error",
    errorCode: error.errorCode || "INTERNAL_SERVER_ERROR",
    message: error.message || "Internal Server Error",
    // stack: process.env.NODE_ENV === "production" ? null : error.stack,
    stack: error.stack,
  });
};
