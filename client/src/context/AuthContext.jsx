import { createContext, useEffect, useReducer } from "react";
import { authService } from "../services/authService";

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
      isLoading: false,
    };
  }

  if (action.type === "LOGIN_START") {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === "LOGIN_FAILURE") {
    return {
      ...state,
      isLoading: false,
    };
  }

  if (action.type === "LOGOUT") {
    return {
      ...state,
      user: null,
      isLoading: false,
    };
  }

  if (action.type === "LOGOUT_START") {
    return {
      ...state,
      isLoading: true,
    };
  }

  if (action.type === "LOGOUT_FAILURE") {
    return {
      ...state,
      isLoading: false,
    };
  }

  return state;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: "LOGIN_START" });
      try {
        const response = await authService.checkAuth();
        dispatch({
          type: "LOGIN",
          payload: { user: response.data.user },
        });
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        dispatch({ type: "LOGIN_FAILURE" });
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const response = await authService.login(credentials);
      dispatch({
        type: "LOGIN",
        payload: { user: response.data.user },
      });
      return response;
    } catch (error) {
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
      dispatch({ type: "LOGOUT_START" });
      const response = await authService.logout();
      dispatch({ type: "LOGOUT" });
      return response;
    } catch (error) {
      dispatch({ type: "LOGOUT_FAILURE" });
      throw error;
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
