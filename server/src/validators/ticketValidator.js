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

export class UserTicketValidator {
  static validateUserTicketData(ticketData, method) {
    const errors = [];

    if (method !== "PATCH") {
      ticketData.tickets.forEach((ticket) => {
        if (!ticket.ticket) errors.push("Ticket is required");
        if (!ticket.quantity) errors.push("Quantity is required");
        if (Number.isNaN(Number(ticket.quantity)) || ticket.quantity <= 0)
          errors.push("Invalid quantity");

        if (errors.length > 0) return errors;
      });
      // if (Number.isNaN(Number(ticketData.quantity)) || ticketData.quantity <= 0)
      //   errors.push("Invalid quantity");
    }

    if (errors.length > 0)
      return {
        isValid: errors.length === 0,
        errorCode: ErrorCode.VALIDATION_ERROR,
        errors: errors,
      };

    return { isValid: true };
  }
}
