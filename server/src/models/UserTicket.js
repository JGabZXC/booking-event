import mongoose from "mongoose";

const userTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  quantityUsed: {
    type: Number,
    default: 0,
    min: 0,
  },
  purchasedDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("UserTicket", userTicketSchema);
