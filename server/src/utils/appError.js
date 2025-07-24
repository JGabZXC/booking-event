import { HTTPSTATUS } from "../config/http.js";
import { ErrorCode } from "../config/errorCode.js";

class AppError extends Error {
  statusCode;
  errorCode;
  constructor(
    message,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode = ErrorCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class HttpException extends AppError {
  constructor(
    message = "HTTP Exception Error",
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode = ErrorCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode, errorCode);
  }
}

export class InternalServerException extends AppError {
  constructor(message = "Internal Server Error") {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}

export class NotFoundException extends AppError {
  constructor(message = "Resource Not Found", errorCode) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCode.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode) {
    super(
      message,
      HTTPSTATUS.BAD_REQUEST,
      errorCode || ErrorCode.VALIDATION_ERROR
    );
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized", errorCode) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCode.AUTH_UNAUTHORIZED
    );
  }
}

export class ForbiddenException extends AppError {
  constructor(message = "Forbidden", errorCode) {
    super(
      message,
      HTTPSTATUS.FORBIDDEN,
      errorCode || ErrorCode.AUTH_UNAUTHORIZED_ACCESS
    );
  }
}

export class ConflictException extends AppError {
  constructor(message = "Conflict", errorCode) {
    super(
      message,
      HTTPSTATUS.CONFLICT,
      errorCode || ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
    );
  }
}

export class TooManyRequestsException extends AppError {
  constructor(message = "Too Many Requests", errorCode) {
    super(
      message,
      HTTPSTATUS.TOO_MANY_REQUESTS,
      errorCode || ErrorCode.AUTH_TOO_MANY_REQUESTS
    );
  }
}

export class UnprocessableEntityException extends AppError {
  constructor(message = "Unprocessable Entity", errorCode) {
    super(
      message,
      HTTPSTATUS.UNPROCESSABLE_ENTITY,
      errorCode || ErrorCode.VALIDATION_ERROR
    );
  }
}
