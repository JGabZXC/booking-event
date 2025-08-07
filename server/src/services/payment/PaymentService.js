import { NotFoundException } from "../../utils/appError.js";

export default class PaymentService {
  constructor(
    paymentStrategy,
    paymentRepository,
    ticketRepository,
    userTicketService
  ) {
    this.paymentStrategy = paymentStrategy;
    this.paymentRepository = paymentRepository;
    this.ticketRepository = ticketRepository;
    this.userTicketService = userTicketService;
  }

  async createPayment(paymentData) {
    paymentData.isPaid = true;
    paymentData.status = "succeeded";

    const ticketSelections = [];

    const tickets = await Promise.all(
      paymentData.ticketSelections.map((selection) =>
        this.ticketRepository.getTicket(selection.ticket)
      )
    );

    tickets.forEach((ticket, idx) => {
      if (!ticket) throw new NotFoundException(`Ticket not found`);

      ticketSelections.push({
        ticketType: ticket.type,
        amount: ticket.price * paymentData.ticketSelections[idx].quantity,
        quantity: paymentData.ticketSelections[idx].quantity,
      });
    });

    const insertedUserTickets = await Promise.all(
      paymentData.ticketSelections.map(async (selection) => {
        return this.userTicketService.createUserTicket({
          user: paymentData.user,
          ticket: selection.ticket,
          quantity: selection.quantity,
        });
      })
    );

    paymentData.amount = ticketSelections.reduce(
      (sum, t) => sum + t.amount * t.quantity,
      0
    );
    paymentData.ticket = insertedUserTickets.map((ticket) => ticket._id);

    const paymentRecord = await this.paymentRepository.createPayment(
      paymentData
    );
    return paymentRecord;
  }

  async getPayment(id) {
    const payment = await this.paymentRepository.getPaymentById(id);
    if (!payment)
      throw new NotFoundException(`Payment not found with id: ${id}`);
    return payment;
  }

  async deletePayment(id) {
    const payment = await this.paymentRepository.getPaymentById(id);
    Promise.all(
      payment.ticket.map(async (ticket) => {
        await this.userTicketService.deleteUserTicket(ticket);
      })
    );
  }

  async processPayment(data, currency = "php", populateOptions) {
    const tickets = await Promise.all(
      data.ticketSelections.map((selection) =>
        this.ticketRepository.getTicket(selection.ticket, populateOptions)
      )
    );

    const ticketSelections = [];
    let eventName = null;
    let eventSlug = null;

    for (const ticket of tickets) {
      if (!ticket)
        throw new NotFoundException(
          `Ticket not found: ${data.ticketSelections[idx].ticketId}`
        );

      if (ticket) {
        eventName = ticket.event.title;
        eventSlug = ticket.event.slug;
        break;
      }
    }

    tickets.forEach((ticket, idx) => {
      ticketSelections.push({
        ticketType: ticket.type,
        amount: ticket.price * data.ticketSelections[idx].quantity,
        quantity: data.ticketSelections[idx].quantity,
      });
    });

    // Prepare data for Stripe
    const paymentData = {
      eventName,
      eventSlug,
      clientReferenceId: data.user,
      customerEmail: data.userEmail,
      ticketSelections,
    };

    // Create Stripe session
    const session = await this.paymentStrategy.createSession(
      paymentData,
      currency
    );

    // Save payment record
    paymentData.stripeSessionId = session.id;
    paymentData.paymentIntentId = session.payment_intent;
    paymentData.amount = ticketSelections.reduce((sum, t) => sum + t.amount, 0);
    paymentData.paymentMethod = "stripe";
    const paymentRecord = await this.createPayment(paymentData);

    return {
      sessionId: session.id,
      paymentRecord,
    };
  }
}
