import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Auth/LoginPage/LoginPage";
import SignUpPage from "../pages/Auth/SignupPage/SignupPage";
import AuthChecker from "../components/Auth/AuthChecker";
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
          <AuthChecker>
            <Login />
          </AuthChecker>
        ),
      },
      {
        path: "register",
        element: (
          <AuthChecker>
            <SignUpPage />
          </AuthChecker>
        ),
      },
    ],
  },
]);

export default router;
