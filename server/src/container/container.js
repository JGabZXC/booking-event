import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "src/config/.env") });

import AuthService from "../services/auth/AuthService.js";
import PasswordService from "../services/auth/PasswordService.js";
import TokenService from "../services/auth/TokenService.js";
import MongoUserRepository from "../repositories/MongoUserRepository.js";
import EmailPasswordStrategy from "../strategies/auth/EmailPasswordStrategy.js";
import UserService from "../services/user/UserService.js";
import MongoEventRepository from "../repositories/MongoEventRepository.js";
import SharpProcessorStrategy from "../strategies/image/SharpProcessorStrategy.js";
import ImageProcessorService from "../services/image/ImageProcessorService.js";
import ImageService from "../services/image/ImageService.js";
import S3Strategy from "../strategies/image/S3Strategy.js";
import { BadRequestException } from "../utils/appError.js";
import CloudFrontUrlProvider from "../services/image/CloudFrontUrlProvider.js";
import ImageUrlProvider from "../services/image/ImageUrlProvider.js";
import EventService from "../services/event/EventService.js";
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
    // PROVIDER
    this.register("cloudFrontUrlProvider", () => {
      return new CloudFrontUrlProvider(
        process.env.CLOUDFRONT_URL,
        process.env.CLOUDFRONT_PRIVATE_KEY,
        process.env.CLOUDFRONT_KEY_PAIR_ID
      );
    });
    this.register("imageUrlProvider", (container) => {
      return new ImageUrlProvider(container.get("cloudFrontUrlProvider"));
    });

    // REPOSITORY
    this.register("userRepository", () => new MongoUserRepository());
    this.register("eventRepository", () => {
      return new MongoEventRepository();
    });

    // SERVICE
    this.register("tokenService", () => new TokenService());
    this.register("passwordService", () => new PasswordService());
    this.register("userService", (container) => {
      return new UserService(
        container.get("userRepository"),
        container.get("tokenService"),
        container.get("passwordService")
      );
    });
    this.register("authService", (container) => {
      return new AuthService(container.get("emailPasswordStrategy"));
    });
    this.register("imageProcessorService", (container) => {
      return new ImageProcessorService(container.get("imageProcessorStrategy"));
    });
    this.register("imageService", (container) => {
      return new ImageService(
        container.get("imageStrategy"),
        process.env.S3_BUCKET_NAME
      );
    });
    this.register("eventService", (container) => {
      return new EventService(
        container.get("eventRepository"),
        container.get("imageService"),
        container.get("imageUrlProvider")
      );
    });

    // STRATEGY
    this.register("emailPasswordStrategy", (container) => {
      return new EmailPasswordStrategy(
        container.get("userRepository"),
        container.get("passwordService"),
        container.get("tokenService")
      );
    });
    this.register("imageProcessorStrategy", () => {
      return new SharpProcessorStrategy();
    });
    this.register("imageStrategy", (container) => {
      return new S3Strategy(container.get("imageUrlProvider"));
    });
  }
}

const container = new DIContainer();
export default container;
