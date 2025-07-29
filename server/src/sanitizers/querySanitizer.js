import { BadRequestException } from "../utils/appError.js";

export default class QuerySanitizer {
  static sanitizeSortQuery(req, allowedFields = []) {
    const values = req.query.sort.split(",");

    const sanitized = values
      .filter((field) => allowedFields.includes(field))
      .join(" ");

    return sanitized;
  }

  static sanitizePaginationQuery(req, type = "page") {
    if (isNaN(req.query[type]))
      throw new BadRequestException(
        `${type.charAt(0).toUpperCase() + type.slice(1)} must be a number`
      );

    if (req.query[type] < 1)
      throw new BadRequestException(
        `${type.charAt(0).toUpperCase() + type.slice(1)} must be greater than 0`
      );

    return req.query[type];
  }

  static sanitizeLimitQuery(req) {
    return this.sanitizePaginationQuery(req, "limit");
  }
}
