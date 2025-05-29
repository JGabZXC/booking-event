import jwt from "jsonwebtoken";
import { cookieOptions } from "../config/cookieOption.js";

export function createSendToken(user, statusCode, res) {
  // Create JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // cookieOptions.expires = new Date(
  //   Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000
  // );
  cookieOptions.expires = new Date(Date.now() + 1000 * 60 * 60);

  // Send the token in a cookie
  // res.cookie("jwt", token, cookieOptions);

  // Remove password from user object before sending response
  user.password = undefined;

  // Send response with user data and token
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}
