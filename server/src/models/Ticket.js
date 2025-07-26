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
  },
  images: [String],
  organizers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  place: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["in-progress", "completed", "cancelled", "coming-soon"],
    default: "in-progress",
  },
  genre: {
    type: String,
    required: true,
    enum: ["concert", "theater", "sports", "exhibition", "festival", "other"],
  },
  attendees: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ticket = new mongoose.model("Ticket", ticketSchema);
export default Ticket;
