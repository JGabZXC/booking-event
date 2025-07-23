import jwt from "jsonwebtoken";

export default class TokenService {
  constructor(secret, options = {}) {
    this.secret = secret || process.env.JWT_SECRET;
    this.defaultOptions = {
      expiresIn: options.expiresIn || "24h",
    };
  }

  generateToken(payload, options = {}) {
    const tokenOptions = { ...this.defaultOptions, ...options };

    const tokenPayload = {
      id: payload.user._id,
    };

    return jwt.sign(tokenPayload, this.secret, tokenOptions);
  }

  async verifyToken(token) {
    try {
      return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      }
      throw new Error("Token verification failed");
    }
  }

  async decodeToken(token) {
    return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  }
}
