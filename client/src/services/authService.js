import api from "../api/axios.js";
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  logout: async (credentials) => {
    try {
      const response = await api.post("/auth/logout", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  checkAuth: async () => {
    try {
      const response = await api.get("/auth/check");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
