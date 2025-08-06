export const cookieOptions = {
  expires: null, // Will be set dynamically
  maxAge: null,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};
