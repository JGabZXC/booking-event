import { ErrorCode } from "../../config/errorCode.js";
import { sanitizeReturnUserObject } from "../../sanitizers/userSanitizer.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/appError.js";

export default class UserService {
  constructor(userRepository, tokenService, passwordService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.passwordService = passwordService;
  }

  async updatePassword(userId, data) {
    const validationResult = this.passwordService.validatePassword(data);

    if (!validationResult.isValid)
      throw new BadRequestException(
        "Error: " + validationResult.errors.join(", "),
        ErrorCode.VALIDATION_ERROR
      );

    const user = await this.userRepository.getUserByIdAuth(userId);
    if (!user)
      throw new BadRequestException(
        "User not found",
        ErrorCode.AUTH_USER_NOT_FOUND
      );

    console.log(data);

    if (
      !(await this.passwordService.verify(data.currentPassword, user.password))
    )
      throw new BadRequestException(
        "Incorrect password",
        ErrorCode.AUTH_INCORRECT_PASSWORD
      );

    const passwordHash = await this.passwordService.hash(data.password);

    // Using the pre-save middleware to set passwordConfirm to undefined
    user.password = passwordHash;
    user.passwordConfirm = passwordHash;
    user.passwordChangedAt = new Date();
    const updatedUser = await user.save();
    const sanitizeUser = sanitizeReturnUserObject(updatedUser);

    const token = await this.tokenService.generateToken(updatedUser);

    return { token, sanitizeUser };
  }

  async validateAuthenticatedUser(token) {
    const decoded = await this.tokenService.verifyToken(token);
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
        "Password has been changed. Please log in again",
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
