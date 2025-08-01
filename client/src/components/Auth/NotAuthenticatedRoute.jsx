import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NotAuthenticatedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user) {
    navigate("/", { replace: true });
  }

  return children;
}
