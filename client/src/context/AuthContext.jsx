import { createContext, useEffect, useReducer } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext({
  user: null,
  isLoading: false,
  login: async (credentials) => {},
  register: async (userData) => {},
  logout: async () => {},
  setUser: (user) => {},
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
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.checkAuth();
        dispatch({
          type: "LOGIN",
          payload: { user: response.data.user },
        });
      } catch (error) {
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
