import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    required: true,
    enum: ["regular", "vip", "student"],
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

ticketSchema.index({ event: 1, type: 1 }, { unique: true });

export default mongoose.model("Ticket", ticketSchema);
