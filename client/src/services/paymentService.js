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
  getAllPayments: (sort = "_id", page = 1, limit = 10) => {
    const populateOptions = [
      {
        path: "ticket",
        select: "quantity quantityUsed ticket",
        populate: {
          path: "ticket",
          select: "event type",
          populate: {
            path: "event",
            select: "title slug",
          },
        },
      },
    ];
    return api.get(
      `/payments?sort=${sort}&page=${page}&limit=${limit}&populateOptions=${JSON.stringify(
        populateOptions
      )}`
    );
  },
};
