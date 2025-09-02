export default class AuthService {
  constructor(authStrategy) {
    this.authStrategy = authStrategy;
  }

  setStrategy(strategy) {
    this.authStrategy = strategy;
  }

  async login(credentials) {
    return await this.authStrategy.authenticate(credentials);
  }

  async register(userData, isAdmin) {
    return this.authStrategy.register(userData, isAdmin);
  }
}
