import AuthService from "../services/auth/AuthService.js";
import PasswordService from "../services/auth/PasswordService.js";
import TokenService from "../services/auth/TokenService.js";
import MongoUserRepository from "../repositories/MongoUserRepository.js";
import EmailPasswordStrategy from "../strategies/auth/EmailPasswordStrategy.js";
import UserService from "../services/user/UserService.js";
import { BadRequestException } from "../utils/appError.js";

class DIContainer {
  constructor() {
    this.services = new Map();
    this.factories = new Map();
    this.registerServices();
  }

  register(name, factory) {
    this.factories.set(name, factory);
  }

  get(name) {
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    const factory = this.factories.get(name);
    if (!factory)
      throw new BadRequestException(`Service ${name} not registered`);

    const instance = factory(this);

    this.services.set(name, instance);
    return instance;
  }

  has(name) {
    return this.factories.has(name);
  }

  clear() {
    this.services.clear();
  }

  registerServices() {
    this.register("userRepository", () => new MongoUserRepository());

    this.register("tokenService", () => new TokenService());
    this.register("passwordService", () => new PasswordService());

    this.register("userService", (container) => {
      return new UserService(
        container.get("userRepository"),
        container.get("tokenService")
      );
    });

    this.register("emailPasswordStrategy", (container) => {
      return new EmailPasswordStrategy(
        container.get("userRepository"),
        container.get("passwordService"),
        container.get("tokenService")
      );
    });

    this.register("authService", (container) => {
      return new AuthService(container.get("emailPasswordStrategy"));
    });
  }
}

const container = new DIContainer();
export default container;
