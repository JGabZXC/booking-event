import api from "../api/axios";

export const ticketService = {
  getTicket: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
