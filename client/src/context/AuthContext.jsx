import { createContext, useState, useReducer } from "react";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: async (credentials) => {},
  register: async (userData) => {},
  logout: async () => {},
});

function authReducer(state, action) {
  if (action.type === "LOGIN") {
    return {
      ...state,
      user: action.payload.user,
    };
  }

  if (action.type === "LOGOUT") {
    return {
      ...state,
      user: null,
    };
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
  });

  const login = async (credentials) => {
    console.log("You are in login auth context");
    try {
      const response = await authService.login(credentials);
      dispatch({
        type: "LOGIN",
        payload: { user: response.data.user },
      });
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  //   const register = async (userData) => {
  //     setIsLoading(true);
  //     try {
  //       const response = await authService.register(userData);
  //       setUser(response.data.user);
  //       toast.success("Registration successful!");
  //       return response;
  //     } catch (error) {
  //       console.error("Registration failed:", error);
  //       toast.error(error.message || "Registration failed. Please try again.");
  //       throw error;
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const logout = async () => {
    try {
      await authService.logout();

      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, isLoading: state.isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
