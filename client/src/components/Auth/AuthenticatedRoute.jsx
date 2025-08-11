import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../UI/Loading";

export default function AuthenticatedRoute({ children }) {
  const { user, isAuthChecking } = useContext(AuthContext);

  if (isAuthChecking) {
    return <Loading message="Please wait" />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
