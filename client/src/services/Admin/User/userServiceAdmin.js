import api from "../../../api/axios";

export const userServiceAdmin = {
  getAllUsers: async (sort = "_id", page = 1, limit = 10, filter = "") => {
    try {
      const response = await api.get("/users", {
        query: { sort, page, limit, filter },
      });
      return response.data;
    } catch (error) {
      return (
        error.response?.data || "An error occurred while fetching the users."
      );
    }
  },
  checkUser: async (identifier) => {
    try {
      const response = await api.get(`/users/${identifier}`);
      return response.data;
    } catch (error) {
      return (
        error.response?.data || "An error occurred while fetching the user."
      );
    }
  },
  createUser: async (userData) => {
    try {
      const response = await api.post(`/auth/register/admin`, userData);
      return response;
    } catch (error) {
      return (
        error.response?.data || "An error occured while creating the user."
      );
    }
  },
};
