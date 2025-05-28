import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  coverImage: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  place: {
    type: String,
    required: true,
    trim: true,
  },
  attendees: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "cancelled", "coming-soon"],
    default: "in-progress",
  },
});

const Ticket = new mongoose.model("Ticket", ticketSchema);
export default Ticket;
