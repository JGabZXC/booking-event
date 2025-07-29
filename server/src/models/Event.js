import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  coverImage: {
    fileName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    urlExpires: {
      type: Date,
      required: true,
    },
  },
  images: [
    {
      fileName: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      urlExpires: {
        type: Date,
        required: true,
      },
    },
  ],
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
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

const Event = new mongoose.model("Event", eventSchema);
export default Event;
