import api from "../api/axios";

export const userTicketService = {
  getMyTickets: async () => {
    const populateOptions = [
      {
        path: "ticket",
        select: "event type price",
        populate: {
          path: "event",
          select: "title date coverImage genre",
        },
      },
    ];
    try {
      const response = await api.get(
        `/users/my-tickets?populateOptions=${JSON.stringify(populateOptions)}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
