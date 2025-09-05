import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import container from "../container/container.js";
import { BadRequestException } from "../utils/appError.js";

const userService = container.get("userService");

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { sort, page, limit, options } = req.query;

  const newOptions = options ? JSON.parse(options) : {};

  if (newOptions.filter?.email) {
    newOptions.filter.email = {
      $regex: newOptions.filter.email,
      $options: "i",
    };
  }

  const usersData = await userService.getAllUsers(
    sort,
    page,
    limit,
    newOptions
  );

  if (page > usersData.totalPages)
    throw new BadRequestException("Page number exceeds total pages");

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: usersData,
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userService.getUser(req.params.identifier);

  return res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: user,
  });
});

export const updateUserAdmin = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updateUserDetails(
    req.params.identifier,
    req.body
  );

  return res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: updatedUser,
  });
});

export const updateUserPasswordAdmin = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updateUserPassword(
    req.params.identifier,
    req.body,
    true // isAdmin flag to indicate admin update
  );

  return res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: updatedUser,
  });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updateUserPassword(
    req.user._id,
    req.body
  );

  res.cookie("jwt", updatedUser.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
  });

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: updatedUser,
  });
});

export const updateMe = asyncHandler(async (req, res, next) => {
  const updatedUser = await userService.updateUserDetails(
    req.user._id,
    req.body
  );

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: updatedUser,
  });
});
