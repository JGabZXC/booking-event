import mongoose from "mongoose";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/appError.js";

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

  async buildTicketSelections(ticketSelections, populateOptions) {
    const tickets = await Promise.all(
      ticketSelections.map((selection) =>
        this.ticketRepository.getTicket(selection.ticket, populateOptions)
      )
    );

    return tickets.map((ticket, idx) => {
      if (!ticket) throw new NotFoundException("Ticket not found");
      return {
        eventName: ticket.event.title,
        type: ticket.type,
        price: ticket.price,
        quantity: ticketSelections[idx].quantity,
        ticket: ticket._id,
      };
    });
  }

  async insertUserTickets(user, ticketSelections, session) {
    const userTickets = ticketSelections.map((selection) => {
      return this.userTicketService.createUserTicket({
        user,
        ticket: selection.ticket,
        quantity: selection.quantity,
        session,
      });
    });
    return Promise.all(userTickets);
  }

  async createPayment(paymentData, session) {
    const paymentRecord = await this.paymentRepository.createPayment(
      paymentData,
      session
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

  /*
    DEPRECATED CHECKOUT SESSION
  */
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

  async processPaymentIntent(data, currency = "php", populateOptions) {
    const ticketSelections = await this.buildTicketSelections(
      data.tickets,
      populateOptions
    );

    const intentData = {
      ticketSelections,
      clientReferenceId: String(data.user),
      customerEmail: data.userEmail,
      customerName: data.userName,
    };

    const paymentIntent = await this.paymentStrategy.createIntent(
      intentData,
      currency
    );

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    };
  }

  async insertPayment(data, populateOptions) {
    const paymentIntent = await this.paymentStrategy.retrieveIntent(
      data.paymentIntentId
    );

    if (paymentIntent.status !== "succeeded")
      throw new BadRequestException("Payment not successful");

    if (
      paymentIntent.metadata &&
      paymentIntent.metadata.client_reference_id !== String(data.user)
    )
      throw new BadRequestException("Payment not authorized");

    const tickets = await Promise.all(
      data.tickets.map((selection) =>
        this.ticketRepository.getTicket(selection.ticketId, populateOptions)
      )
    );

    const ticketSelections = tickets.map((ticket, idx) => ({
      ticket: ticket._id,
      ticketType: ticket.type,
      amount: ticket.price * data.tickets[idx].quantity,
      quantity: data.tickets[idx].quantity,
    }));

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await Promise.all(
        tickets.map((ticket, idx) => {
          return this.ticketRepository.updateTicket(
            ticket._id,
            {
              availableQuantity:
                ticket.availableQuantity - data.tickets[idx].quantity,
            },
            session
          );
        })
      );

      const insertedUserTickets = await this.insertUserTickets(
        data.user,
        ticketSelections,
        session
      );

      const paymentData = {
        user: data.user,
        ticketSelections,
        paymentIntentId: paymentIntent.id,
        amount: ticketSelections.reduce((sum, t) => sum + t.amount, 0),
        paymentMethod: "stripe",
        isPaid: true,
        status: "succeeded",
        ticket: insertedUserTickets.map((ticket) => ticket._id),
      };
      const paymentRecord = await this.createPayment(paymentData, session);

      await session.commitTransaction();
      session.endSession();
      return { paymentRecord };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      this.paymentStrategy.refundPayment(
        paymentIntent.id,
        "requested_by_customer",
        { system_reason: "Ticket purchase failed" }
      );
      throw err;
    }
  }
}
