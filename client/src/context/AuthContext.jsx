import { createContext, useEffect, useReducer, useState } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext({
  user: null,
  isLoading: false,
  isAuthChecking: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  setUser: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    case "REGISTER_START":
      return {
        ...state,
        isLoading: true,
      };
    case "REGISTER":
      return {
        ...state,
        isLoading: false,
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    case "LOGOUT_START":
      return {
        ...state,
        isLoading: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isLoading: false,
      };
    case "LOGOUT_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
  });

  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.checkAuth();
        dispatch({
          type: "LOGIN",
          payload: { user: response.data.user },
        });
        localStorage.setItem("auth", true);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dispatch({ type: "LOGIN_FAILURE" });
      } finally {
        setIsAuthChecking(false);
      }
    };

    if (localStorage.getItem("auth")) {
      checkAuth();
    } else {
      setIsAuthChecking(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const response = await authService.login(credentials);
      dispatch({
        type: "LOGIN",
        payload: { user: response.data.user },
      });
      localStorage.setItem("auth", true);
      return response;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: "REGISTER_START" });
    try {
      const response = await authService.register(userData);
      dispatch({
        type: "REGISTER",
      });
      return response;
    } catch (error) {
      dispatch({ type: "REGISTER_FAILURE" });
      throw error;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: "LOGOUT_START" });
      const response = await authService.logout();
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("auth");
      return response;
    } catch (error) {
      dispatch({ type: "LOGOUT_FAILURE" });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        isAuthChecking,
        login,
        logout,
        register,
        setUser: (user) => dispatch({ type: "LOGIN", payload: { user } }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
