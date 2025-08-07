import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticket: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserTicket",
      required: true,
    },
  ],
  // Amount will be multiplied in quantity from Ticket model: e.g if quantity is 2 and purchased regular ticket (50 pesos), amount will be 100 pesos
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["stripe", "manual"],
  },
  stripeSessionId: String,
  paymentIntentId: String, // This can be Official Receipt if Manual Payment
  status: {
    type: String,
    required: true,
    enum: ["succeeded", "pending", "failed", "refunded"],
    default: "pending",
  },
  isPaid: { type: Boolean, default: false },
});

export default mongoose.model("Payment", paymentSchema);
