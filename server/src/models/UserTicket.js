import mongoose from "mongoose";

const userTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  purchasedDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("UserTicket", userTicketSchema);
