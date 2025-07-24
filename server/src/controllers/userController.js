import { ErrorCode } from "../config/errorCode.js";
import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as validation from "../utils/validation.js";
import { BadRequestException } from "../utils/appError.js";
import { capitalizeFullName } from "../utils/capitalizeName.js";
import { createSendToken } from "../utils/createSendToken.js";
import User from "../models/User.js";

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user)
    return next(
      new BadRequestException("User not found", ErrorCode.AUTH_USER_NOT_FOUND)
    );

  const isCorrect = await user.comparePassword(user.password, currentPassword);
  if (!isCorrect)
    return next(
      new BadRequestException(
        "Current password is incorrect",
        ErrorCode.AUTH_INVALID_CREDENTIALS
      )
    );

  if (!validation.validatePassword(password))
    return next(
      new BadRequestException(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        ErrorCode.VALIDATION_ERROR
      )
    );

  if (!validation.validatePasswordConfirm(password, passwordConfirm))
    return next(
      new BadRequestException(
        "Password and password confirmation do not match.",
        ErrorCode.VALIDATION_ERROR
      )
    );

  user.password = password;
  user.passwordConfirm = undefined;
  user.passwordChangedAt = Date.now();
  const updatedUser = await user.save({ validateModifiedOnly: true });
  createSendToken(updatedUser, HTTPSTATUS.OK, res);
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
