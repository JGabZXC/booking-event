import { ErrorCode } from "../../config/errorCode.js";
import { sanitizeReturnUserObject } from "../../sanitizers/userSanitizer.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/appError.js";
import { capitalizeFullName } from "../../utils/capitalizeName.js";
import * as validation from "../../utils/validation.js";

export default class UserService {
  constructor(userRepository, tokenService, passwordService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.passwordService = passwordService;
  }

  async getAllUsers(sort, page = 1, limit = 10) {
    return this.userRepository.getAllUsers(sort, page, limit).then((data) => ({
      users: data.users.map((user) =>
        sanitizeReturnUserObject(user, [
          "password",
          "validTokenDate",
          "passwordChangedAt",
          "ticketsPurchased",
        ])
      ),
      totalDocs: data.totalDocs,
      totalPages: data.totalPages,
    }));
  }

  async getUserByIdOrEmail(identifier) {
    const isEmail = validation.validateEmail(identifier);

    let user;
    if (isEmail) user = await this.userRepository.getUserByEmail(identifier);
    else user = await this.userRepository.getUserById(identifier);

    if (!user)
      throw new BadRequestException(
        "User not found",
        ErrorCode.AUTH_USER_NOT_FOUND
      );

    return sanitizeReturnUserObject(user, [
      "password",
      "validTokenDate",
      "passwordChangedAt",
      "ticketsPurchased",
    ]);
  }

  async getUserByIdOrEmailAuth(identifier) {
    const isEmail = validation.validateEmail(identifier);

    let user;
    if (isEmail)
      user = await this.userRepository.getUserByEmailAuth(identifier);
    else user = await this.userRepository.getUserByIdAuth(identifier);

    if (!user)
      throw new BadRequestException(
        "User not found",
        ErrorCode.AUTH_USER_NOT_FOUND
      );

    return sanitizeReturnUserObject(user, [
      "password",
      "validTokenDate",
      "passwordChangedAt",
    ]);
  }

  async updateUserPassword(identifier, data, isAdmin = false) {
    const validationResult = this.passwordService.validatePassword(data);

    if (!validationResult.isValid)
      throw new BadRequestException(
        "Error: " + validationResult.errors.join(", "),
        ErrorCode.VALIDATION_ERROR
      );

    const isEmail = validation.validateEmail(identifier);
    let user;
    if (isEmail)
      user = await this.userRepository.getUserByEmailAuth(identifier);
    else user = await this.userRepository.getUserByIdAuth(identifier);

    if (!user)
      throw new BadRequestException(
        "User not found",
        ErrorCode.AUTH_USER_NOT_FOUND
      );

    if (!isAdmin)
      if (
        !(await this.passwordService.verify(
          data.currentPassword,
          user.password
        ))
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
    const sanitizeUser = sanitizeReturnUserObject(updatedUser, [
      "password",
      "validTokenDate",
      "passwordChangedAt",
      "ticketsPurchased",
    ]);

    const token = await this.tokenService.generateToken(updatedUser);

    return { token, sanitizeUser };
  }

  async updateUserDetails(identifier, data) {
    if (data.email && !validation.validateEmail(data.email)) {
      throw new BadRequestException(
        "Invalid email format",
        ErrorCode.VALIDATION_ERROR
      );
    }

    if (data.name && !validation.validateFullName(data.name)) {
      throw new BadRequestException(
        "Invalid name format",
        ErrorCode.VALIDATION_ERROR
      );
    }

    if (data.name) {
      data.name = capitalizeFullName(data.name);
    }

    const isEmail = validation.validateEmail(identifier);
    let user;
    if (isEmail)
      user = await this.userRepository.updateUserByEmail(identifier, data);
    else user = await this.userRepository.updateUserById(identifier, data);

    if (!user)
      throw new BadRequestException(
        "User not found",
        ErrorCode.AUTH_USER_NOT_FOUND
      );
    return sanitizeReturnUserObject(user, [
      "password",
      "validTokenDate",
      "passwordChangedAt",
      "ticketsPurchased",
    ]);
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
