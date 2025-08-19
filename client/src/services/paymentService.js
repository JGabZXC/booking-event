import api from "../api/axios";

function ticketBodyBuilder(data) {
  return [
    ...data.map((ticket) => ({
      ticket: ticket.ticketId,
      quantity: ticket.quantity,
    })),
  ];
}

export const paymentService = {
  createIntent: (tickets) => {
    const newTicketForm = { tickets: ticketBodyBuilder(tickets) };
    return api.post("/payments/process-payment-intent", newTicketForm);
  },
  confirmPayment: (tickets, paymentIntentId) => {
    const newTicketForm = {
      tickets: ticketBodyBuilder(tickets),
      paymentIntentId,
    };
    return api.post("/payments/confirm-payment", newTicketForm);
  },
};
