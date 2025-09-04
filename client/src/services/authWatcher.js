import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios"; // adjust if your axios instance path differs

const TOKEN_KEY = "token"; // change if you store it under a different key

function decodeExp(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export default function AuthWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function logout(redirect = true) {
      localStorage.removeItem(TOKEN_KEY);
      // clear other auth state if any
      if (redirect && location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }

    const token = localStorage.getItem(TOKEN_KEY);
    let timeoutId;

    if (token) {
      const expMs = decodeExp(token);
      if (!expMs || expMs <= Date.now()) {
        logout();
      } else {
        const delay = expMs - Date.now();
        timeoutId = setTimeout(() => logout(), delay);
      }
    }

    // Axios 401 interceptor
    const respInterceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      api.interceptors.response.eject(respInterceptor);
    };
  }, [navigate, location]);

  return null; // invisible watcher
}
