import api from "../api/axios";

export const eventService = {
  getAllEvents: async (sort = "-title", page = 1, limit = 10, filter = "") => {
    try {
      const response = await api.get("/events", {
        params: { sort, page, limit, filter },
      });
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred while fetching events.";
    }
  },
  getEvent: async (eventSlug) => {
    try {
      const response = await api.get(
        `/events/${eventSlug}?populate=[{"path":"organizers", "select":"name"}]`
      );
      return response;
    } catch (error) {
      throw (
        error.response?.data || "An error occurred while fetching the event."
      );
    }
  },
  getEventTickets: async (eventId) => {
    try {
      const response = await api.get(`/events/${eventId}/tickets`);
      return response;
    } catch (error) {
      throw error.response?.data || "An error occurred while fetching tickets.";
    }
  },
};
