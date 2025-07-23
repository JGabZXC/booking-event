export const cookieOptions = {
  expires: null, // Will be set dynamically in createSendToken
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES,
};
