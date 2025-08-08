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

  async buildTicketSelections(ticketSelections) {
    const tickets = await Promise.all(
      ticketSelections.map((selection) =>
        this.ticketRepository.getTicket(selection.ticket)
      )
    );

    return tickets.map((ticket, idx) => {
      if (!ticket) throw new NotFoundException("Ticket not found");
      return {
        type: ticket.type,
        price: ticket.price,
        quantity: ticketSelections[idx].quantity,
        ticket: ticket._id,
      };
    });
  }

  async insertUserTickets(user, ticketSelections) {
    const userTickets = ticketSelections.map((selection) => {
      return this.userTicketService.createUserTicket({
        user,
        ticket: selection.ticket,
        quantity: selection.quantity,
      });
    });
    return Promise.all(userTickets);
  }

  async createPayment(paymentData) {
    const ticketSelections = await this.buildTicketSelections(
      paymentData.ticketSelections
    );

    const insertedUserTickets = await this.insertUserTickets(
      paymentData.user,
      ticketSelections
    );

    paymentData.isPaid = true;
    paymentData.status = "succeeded";
    paymentData.amount = ticketSelections.reduce(
      (sum, t) => sum + t.price * t.quantity,
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
    const payment = await this.paymentRepository.deletePayment(id);
    if (!payment)
      throw new NotFoundException(`Payment not found with id: ${id}`);

    Promise.all(
      payment.ticket.map((ticket) => {
        this.userTicketService.deleteUserTicket(ticket);
      })
    );

    return payment;
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
