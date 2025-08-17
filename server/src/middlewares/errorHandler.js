import { HTTPSTATUS } from "../config/http.js";
import errorHandlerUtil from "../utils/errorHandlerUtil.js";

export const errorHandler = (err, req, res, next) => {
  console.log(err);
  const error = errorHandlerUtil(err);
  return res.status(err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    status: "error",
    errorCode: error.errorCode || "INTERNAL_SERVER_ERROR",
    message: error.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};
