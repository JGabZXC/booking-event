import api from "../api/axios.js";

export const userService = {
  updateUser: async (userData) => {
    try {
      const response = await api.patch("/users/update/me", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  changePassword: async (passwordData) => {
    try {
      const response = await api.patch("/users/update/password", passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
