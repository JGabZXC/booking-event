import { ErrorCode } from "../../config/errorCode.js";
import { UnauthorizedException } from "../../utils/appError.js";

export default class UserService {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async validateAuthenticatedUser(token) {
    const decoded = this.tokenService.verifyToken(token);
    const user = await this.userRepository.getUserById(decoded.id);

    if (!user)
      throw new UnauthorizedException(
        "User not found",
        ErrorCode.AUTH_USER_NOT_FOUND
      );

    if (
      await this.tokenService.isPasswordChangedTimestamp(
        token,
        user.passwordChangedAt
      )
    )
      throw new UnauthorizedException(
        "Password has been changed. Please log in again.",
        ErrorCode.AUTH_PASSWORD_CHANGED
      );

    if (await this.tokenService.isValidToken(user.validTokenDate, decoded.iat))
      throw new UnauthorizedException(
        "This token is no longer valid, please log in again",
        ErrorCode.AUTH_INVALID_TOKEN
      );

    return user;
  }
}
