import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import container from "../container/container.js";
import { BadRequestException } from "../utils/appError.js";

const userService = container.get("userService");

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { sort, page, limit } = req.query;

  const usersData = await userService.getAllUsers(sort, page, limit);

  if (page > usersData.totalPages)
    throw new BadRequestException("Page number exceeds total pages");

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: usersData,
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await userService.getUserByIdOrEmail(req.params.identifier);

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
