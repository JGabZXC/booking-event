import Stripe from "stripe";

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
}
