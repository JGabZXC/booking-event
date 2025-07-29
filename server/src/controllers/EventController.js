import { HTTPSTATUS } from "../config/http.js";
import { ErrorCode } from "../config/errorCode.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BadRequestException, NotFoundException } from "../utils/appError.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

import container from "../container/container.js";

const eventService = container.get("eventService");

export const getAllEvents = asyncHandler(async (req, res, next) => {
  const { sort, page, limit } = req.query;

  const eventsData = await eventService.getAllEvents(sort, page, limit);

  if (page > eventsData.totalPages)
    throw new BadRequestException("Page number exceeds total pages");

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: eventsData,
  });
});

export const getEvent = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const event = await eventService.getEvent(identifier);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    message: "Fetched event successfully",
    data: event,
  });
});

export const createEvent = asyncHandler(async (req, res) => {
  req.body.date = new Date();

  const event = await eventService.createEvent(req.body, req.files);

  res.status(HTTPSTATUS.CREATED).json({
    status: "success",
    message: "Event created successfully",
    data: event,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const event = await eventService.updateEvent(identifier, req.body, req.files);

  res.status(HTTPSTATUS.OK).json({
    status: "success",
    data: event,
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  await eventService.deleteEvent(identifier);

  res.status(HTTPSTATUS.NO_CONTENT).json({
    status: "success",
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
