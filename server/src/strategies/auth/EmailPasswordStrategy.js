import { ErrorCode } from "../../config/errorCode.js";
import IAuthStrategy from "../../interfaces/IAuthStrategy.js";
import { sanitizeReturnUserObject } from "../../sanitizers/userSanitizer.js";
import { BadRequestException } from "../../utils/appError.js";

export default class EmailPasswordStrategy extends IAuthStrategy {
  constructor(userRepository, passwordService, tokenService) {
    super();
    this.userRepository = userRepository;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
  }

  async authenticate(credentials) {
    const { email, password } = credentials;

    const user = await this.userRepository.getUserByEmailAuth(email);
    if (!user)
      throw new BadRequestException("User not found", ErrorCode.USER_NOT_FOUND);

    if (!(await this.passwordService.verify(password, user.password)))
      throw new BadRequestException(
        "Invalid credential",
        ErrorCode.AUTH_INVALID_CREDENTIALS
      );

    const token = await this.tokenService.generateToken(user);

    const sanitizeUser = sanitizeReturnUserObject(user, [
      "password",
      "ticketsPurchased",
      "validTokenDate",
      "passwordChangedAt",
    ]);

    await this.userRepository.updateUserById(user._id, {
      validTokenDate: new Date(),
    });

    return { token, user: sanitizeUser };
  }

  async register(userData, isAdmin = false) {
    const { name, email, password, role } = userData;

    const passwordHash = await this.passwordService.hash(password);

    const newUser = {
      name,
      email,
      password: passwordHash,
      passwordConfirm: passwordHash,
      role: isAdmin ? role : "user",
    };

    return sanitizeReturnUserObject(
      await this.userRepository.createUser(newUser),
      ["password", "validTokenDate", "passwordChangedAt", "ticketsPurchased"]
    );
  }
}
