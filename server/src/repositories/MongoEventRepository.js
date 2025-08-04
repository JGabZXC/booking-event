import mongoose from "mongoose";
import IEventRepository from "../interfaces/IEventRepository.js";
import Event from "../models/Event.js";

export default class MongoEventRepository extends IEventRepository {
  async getAllEvents(sort = "_id", page = 1, limit = 10, filter = "") {
    const skip = (page - 1) * limit;
    const [events, totalDocs] = await Promise.all([
      Event.find({ genre: filter }).sort(sort).skip(skip).limit(limit),
      Event.countDocuments({ genre: filter }),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { totalDocs, totalPages, events };
  }

  async getEvent(identifier) {
    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    const event = await Event.findOne(query);

    return event;
  }

  async createEvent(eventData) {
    return await Event.create(eventData);
  }

  async updateEvent(identifier, eventData) {
    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }

    return await Event.findOneAndUpdate(query, eventData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteEvent(identifier) {
    let query;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query = { _id: identifier };
    } else {
      query = { slug: identifier };
    }
    return await Event.findOneAndDelete(query);
  }

  async getEventsByUserIdOrEmail(
    identifier,
    sort = "_id",
    page = 1,
    limit = 10
  ) {
    const skip = (page - 1) * limit;
    const query = {
      $or: [{ _id: identifier }, { email: identifier }],
    };
    const [events, totalDocs] = await Promise.all([
      Event.find(query).sort(sort).skip(skip).limit(limit),
      Event.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalDocs / limit);
    return { events, totalDocs, totalPages };
  }
}
