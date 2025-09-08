import api from "../../../api/axios";

export const userServiceAdmin = {
  getAllUsers: async (sort = "_id", page = 1, limit = 10, filter = {}) => {
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
  searchUser: async (identifier) => {
    const options = {
      filter: {
        email: identifier,
      },
    };

    try {
      const response = await api.get(`/users`, {
        params: { options: JSON.stringify(options) },
      });
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
  updateUserDetails: async (identifier, userData) => {
    try {
      const response = await api.patch(`/users/${identifier}`, userData);
      return response.data;
    } catch (err) {
      return err.response?.data || "An error occured while updating the user.";
    }
  },
  deleteUser: async (identifier) => {
    try {
      const response = await api.delete(`/users/${identifier}`);
      return response.data;
    } catch (err) {
      return err.response?.data || "An error occured while deleting the user.";
    }
  },
};
