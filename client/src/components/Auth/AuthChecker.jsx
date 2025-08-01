import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthChecker({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("AuthChecker user:", user);

  if (user) {
    navigate("/", { replace: true });
  }

  return children;
}
