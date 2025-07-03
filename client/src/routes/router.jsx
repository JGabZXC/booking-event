import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/LoginPage/LoginPage";
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
        element: <Login />,
      },
    ],
  },
]);

export default router;
