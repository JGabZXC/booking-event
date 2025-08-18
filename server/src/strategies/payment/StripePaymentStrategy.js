import Stripe from "stripe";
import { NotFoundException } from "../../utils/appError.js";

export default class StripePaymentStrategy {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createSession(data, currency = "php") {
    const line_items = data.ticketSelections.map((ticket) => ({
      price_data: {
        currency,
        product_data: {
          name: `${data.eventName} - ${ticket.ticketType}`,
        },
        unit_amount: ticket.amount * 100, // Convert to cents
      },
      quantity: ticket.quantity || 1,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      client_reference_id: data.clientReferenceId,
      customer_email: data.customerEmail,
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/events/${data.eventSlug}`,
    });
    return session;
  }

  async createIntent(data, currency = "php") {
    const line_items = data.ticketSelections.map((ticket) => ({
      price_data: {
        currency,
        product_data: {
          name: `${ticket.eventName} - ${ticket.ticketType}`,
        },
        unit_amount: ticket.amount * 100, // Convert to cents
      },
      quantity: ticket.quantity || 1,
    }));

    const customer = await this.stripe.customers.create({
      email: data.customerEmail,
      name: data.customerName,
    });

    const intent = await this.stripe.paymentIntents.create({
      customer: customer.id,
      amount: line_items.reduce(
        (sum, item) => sum + item.price_data.unit_amount * item.quantity,
        0
      ),
      currency,
      payment_method_types: ["card"],
      metadata: {
        client_reference_id: data.clientReferenceId,
        customer_email: data.customerEmail,
      },
    });

    return intent;
  }

  async retrieveIntent(intentId) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(intentId);
    if (!paymentIntent) {
      throw new NotFoundException(
        `Payment intent with ID ${intentId} not found`
      );
    }
    return paymentIntent;
  }
}
