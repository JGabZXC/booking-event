import { ErrorCode } from "../config/errorCode.js";

export class TicketValidator {
  static validateTicketData(ticketData, method) {
    const errors = [];

    if (ticketData.price < 0 || Number.isNaN(Number(ticketData.price))) {
      errors.push("Invalid ticket price");
    }
    if (method !== "PATCH" && !ticketData.event) {
      errors.push("Event is required");
    }
    if (!ticketData.type) {
      errors.push("Ticket type is required");
    }
    if (
      ticketData.availableQuantity < 0 ||
      Number.isNaN(Number(ticketData.availableQuantity))
    ) {
      errors.push("Available quantity cannot be negative");
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errorCode: ErrorCode.VALIDATION_ERROR,
        errors: errors,
      };
    }

    return { isValid: true };
  }
}
