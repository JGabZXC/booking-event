import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Auth/LoginPage/LoginPage";
import SignUpPage from "../pages/Auth/SignupPage/SignupPage";
import NotAuthenticatedRoute from "../components/Auth/NotAuthenticatedRoute";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: (
          <NotAuthenticatedRoute>
            <Login />
          </NotAuthenticatedRoute>
        ),
      },
      {
        path: "register",
        element: (
          <NotAuthenticatedRoute>
            <SignUpPage />
          </NotAuthenticatedRoute>
        ),
      },
    ],
  },
]);

export default router;
