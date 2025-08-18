import api from "../api/axios";

export const paymentService = {
  createIntent: (tickets) => {
    const newTicketForm = {
      tickets: [
        ...tickets.map((ticket) => ({
          ticket: ticket.ticketId,
          quantity: ticket.quantity,
        })),
      ],
    };
    return api.post("/payments/process-payment-intent", newTicketForm);
  },
  confirmPayment: (paymentData) => {
    return api.post("/payments/confirm-payment", paymentData);
  },
};
