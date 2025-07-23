import IAuthStrategy from "../../interfaces/IAuthStrategy.js";

export default class EmailPasswordStrategy extends IAuthStrategy {
  constructor(userRepository, passwordService) {
    super();
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  async authenticate(credentials) {
    const { email, password } = credentials;
    if (!email || !password) {
      throw new Error("Email and password are required for authentication.");
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found.");
    }

    const isValidPassword = await this.passwordService.verify(
      password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials.");
    }

    return user;
  }

  async register(userData) {
    const { name, email, password } = userData;

    const passwordHash = await this.passwordService.hash(password);

    const newUser = {
      name,
      email,
      password: passwordHash,
      passwordConfirm: passwordHash, // For consistency, use the same hash
      role: "user",
    };

    return await this.userRepository.create(newUser);
  }
}
