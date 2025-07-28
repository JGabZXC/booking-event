import { HTTPSTATUS } from "../config/http.js";
import { ErrorCode } from "../config/errorCode.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import QueryOptions from "../utils/queryOptions.js";
import { BadRequestException, NotFoundException } from "../utils/appError.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

import container from "../container/container.js";

const eventRepository = container.get("eventRepository");
const eventImageService = container.get("eventImageService");

export const getAllEvents = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;
  if (page && limit)
    if (Number.isNaN(+page) || Number.isNaN(+limit) || +page < 1 || +limit < 1)
      return next(
        new BadRequestException(
          "Page and limit must be positive integers.",
          ErrorCode.VALIDATION_ERROR
        )
      );

  const query = new QueryOptions(Event.find(), req.query).sort().paginate();

  const [events, totalEvents] = await Promise.all([
    query.query,
    Event.countDocuments(),
  ]);
  const totalPages = Math.ceil(totalTickets / (req.query.limit || 10));

  if (page && page > totalPages)
    return next(
      new BadRequestException(
        `Page number exceeds total pages. Total pages: ${totalPages}`,
        ErrorCode.VALIDATION_ERROR
      )
    );

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched all tickets successfully",
    totalTickets,
    totalPages,
    data: tickets,
  });
});

export const getEvent = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const event = await eventRepository.getEvent(identifier);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched event successfully",
    data: event,
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  req.body.date = new Date();

  const event = await eventImageService.createEvent(req.body, req.files);

  res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    message: "Event created successfully",
    data: event,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.body.attendees)
    return new BadRequestException(
      "Attendees cannot be updated directly.",
      ErrorCode.VALIDATION_ERROR
    );

  const event = await Event.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Event updated successfully",
    data: event,
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findByIdAndDelete(id);

  if (!event)
    return new NotFoundException(
      "No event was found with the provided ID",
      ErrorCode.RESOURCE_NOT_FOUND
    );

  res.status(HTTPSTATUS.NO_CONTENT).json({
    status: "success",
    message: "Ticket deleted successfully",
    data: null,
  });
});

export const purchaseEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(req.user._id);
  const event = await Event.findById(id);

  if (!event)
    return next(
      new NotFoundException(
        "No event was found with the provided ID",
        ErrorCode.RESOURCE_NOT_FOUND
      )
    );

  if (event.status !== "in-progress")
    return next(
      new BadRequestException(
        "Event is not available for purchase",
        ErrorCode.VALIDATION_ERROR
      )
    );

  if (event.attendees.includes(req.user._id))
    return next(
      new BadRequestException(
        "You have already purchased this event",
        ErrorCode.VALIDATION_ERROR
      )
    );

  event.attendees.push(req.user._id);
  user.eventsPurchased.push(event._id);

  const [updatedEvent] = await Promise.all([
    event.save({ validateModifiedOnly: true }),
    user.save({ validateModifiedOnly: true }),
  ]);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Event purchased successfully",
    data: updatedEvent,
  });
});
