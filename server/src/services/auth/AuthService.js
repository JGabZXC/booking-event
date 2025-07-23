export default class AuthService {
  constructor(authStrategy, tokenService) {
    this.authStrategy = authStrategy;
    this.tokenService = tokenService;
  }

  setStrategy(strategy) {
    this.authStrategy = strategy;
  }

  async login(credentials) {
    try {
      const user = await this.authStrategy.authenticate(credentials);

      const token = await this.tokenService.generateToken(user);

      return {
        token,
        user,
      };
    } catch (error) {
      if (error.code === "AUTH_INVALID_CREDENTIALS") {
        throw new Error("Invalid credentials provided");
      }
      throw error;
    }
  }

  async register(userData) {
    try {
      const user = await this.authStrategy.register(userData);

      return user;
    } catch (error) {
      if (error.code === "AUTH_EMAIL_ALREADY_EXISTS") {
        throw new Error("Email already exists");
      }
      throw error;
    }
  }
}
