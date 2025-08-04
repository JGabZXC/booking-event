import api from "../api/axios";

export const eventService = {
  getAllEvents: async (sort = "-title", page = 1, limit = 10, filter = "") => {
    try {
      const response = await api.get("/events", {
        params: { sort, page, limit, filter },
      });
      return response;
    } catch (error) {
      throw error.message || "An error occurred while fetching events.";
    }
  },
};
