import api from "../api/axios.js";
export const authService = {
  login: async (credentials) => {
    try {
      console.log(credentials);
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
