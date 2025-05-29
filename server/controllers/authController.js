import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../model/User.js";
import * as validation from "../utils/validation.js";
import { createSendToken } from "../utils/createSendToken.js";
import { BadRequestException } from "../utils/appError.js";
import { ErrorCode } from "../config/errorCode.js";
import { capitalizedFirstLetter } from "../utils/capitalizeName.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(
      new BadRequestException(
        "No user found with this email",
        ErrorCode.AUTH_USER_NOT_FOUND
      )
    );

  const isCorrect = await user.comparePassword(user.password, password);
  if (!isCorrect)
    return next(
      new BadRequestException(
        "Invalid email or password",
        ErrorCode.AUTH_INVALID_CREDENTIALS
      )
    );

  user.validTokenDate = Date.now();
  await user.save({ validateModifiedOnly: true });
  createSendToken(user, HTTPSTATUS.OK, res);
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  let errors = {};
  if (!validation.validateName(name))
    errors.name = { message: "Invalid name format. Please use only letters." };

  if (!validation.validateEmail(email))
    errors.email = { message: "Invalid email format." };

  if (!validation.validatePassword(password))
    errors.password = {
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    };

  if (!validation.validatePasswordConfirm(password, passwordConfirm))
    errors.passwordConfirmation = {
      message: "Password and password confirmation do not match.",
    };

  if (Object.keys(errors).length > 0)
    return res.status(HTTPSTATUS.UNPROCESSABLE_ENTITY).json({
      status: "fail",
      message: "Validation errors",
      errors,
    });

  const user = await User.create({
    name: capitalizedFirstLetter(name),
    email,
    password,
    passwordConfirm,
  });

  return res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    message: "User registered successfully",
    data: {
      user,
    },
  });
});
