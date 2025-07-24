import { HTTPSTATUS } from "../config/http.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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
  const updatedUser = await userService.updateUserDetails(
    req.user._id,
    req.body
  );

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: updatedUser,
  });
});
