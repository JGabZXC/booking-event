import { validateRegistrationInput } from "../../validators/userValidator.js";
import { sanitizeRegistrationInput } from "../../sanitizers/userSanitizer.js";

export default class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async createUser(userData) {
    try {
      const user = await this.userRepository.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
