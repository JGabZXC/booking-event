import jwt from "jsonwebtoken";
import { promisify } from "util";

export default class TokenService {
  constructor() {
    this.defaultOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    };
  }

  generateToken(payload) {
    const tokenPayload = {
      id: payload._id,
    };

    return jwt.sign(tokenPayload, process.env.JWT_SECRET, this.defaultOptions);
  }

  async verifyToken(token) {
    return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }

  async isPasswordChangedTimestamp(token, passwordChangedAt) {
    if (!passwordChangedAt) return false;

    const decoded = await this.verifyToken(token);
    const changedTimestamp = Math.floor(passwordChangedAt / 1000);

    return changedTimestamp > decoded.iat;
  }

  async isValidToken(tokenDate, validTokenDate) {
    if (!validTokenDate) return false;

    const tokenTimestamp = Math.floor(tokenDate / 1000);

    return tokenTimestamp > validTokenDate;
  }
}
