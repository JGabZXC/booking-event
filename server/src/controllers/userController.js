import { ErrorCode } from "../config/errorCode.js";
import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as validation from "../utils/validation.js";
import { BadRequestException } from "../utils/appError.js";
import User from "../models/User.js";
import container from "../container/container.js";

const userService = container.get("userService");

export const updatePassword = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updatePassword(req.user._id, req.body);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: updatedUser,
  });
});

export const updateMe = asyncHandler(async (req, res, next) => {
  let { name, email } = req.body;

  if (name) {
    name = capitalizedFirstLetter(name);
  }

  if (name && !validation.validateName(name))
    return next(
      new BadRequestException(
        "Name must contain only letters.",
        ErrorCode.VALIDATION_ERROR
      )
    );

  if (email && !validation.validateEmail(email))
    return next(
      new BadRequestException("Email is not valid.", ErrorCode.VALIDATION_ERROR)
    );

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
