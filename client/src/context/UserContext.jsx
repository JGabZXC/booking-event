import { createContext, useReducer, useContext } from "react";
import { userService } from "../services/userService";
import { AuthContext } from "./AuthContext";

export const UserContext = createContext({
  updateUser(userData) {},
  changePassword(passwordData) {},
  isLoading: false,
});

function userReducer(state, action) {
  switch (action.type) {
    case "UPDATE_USER_START":
      return {
        ...state,
        isLoading: true,
      };
    case "UPDATE_USER":
      return {
        ...state,
        isLoading: false,
      };
    case "UPDATE_USER_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    case "CHANGE_PASSWORD_START":
      return {
        ...state,
        isLoading: true,
      };
    case "CHANGE_PASSWORD":
      return {
        ...state,
        isLoading: false,
      };
    case "CHANGE_PASSWORD_FAILURE":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const { user, setUser } = useContext(AuthContext);
  const [state, dispatch] = useReducer(userReducer, {
    isLoading: false,
  });

  const updateUser = async (userData) => {
    const prevUser = user;
    try {
      dispatch({ type: "UPDATE_USER_START" });
      const updatedUser = await userService.updateUser(userData);
      setUser(updatedUser.data);
      dispatch({ type: "UPDATE_USER" });
    } catch (error) {
      setUser(prevUser);
      dispatch({ type: "UPDATE_USER_FAILURE" });
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      dispatch({ type: "CHANGE_PASSWORD_START" });
      await userService.changePassword(passwordData);
      dispatch({ type: "CHANGE_PASSWORD" });
    } catch (error) {
      dispatch({ type: "CHANGE_PASSWORD_FAILURE" });
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLoading: state.isLoading,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
