import api from "../../../api/axios";

export const userServiceAdmin = {
  getAllUser: async (sort = "_id", page = 1, limit = 10, filter = "") => {
    try {
      const response = await api.get("/users", {
        params: { sort, page, limit, filter },
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
};
