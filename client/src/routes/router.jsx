import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/RootLayout";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Auth/LoginPage/LoginPage";
import SignUpPage from "../pages/Auth/SignupPage/SignupPage";
import NotAuthenticatedRoute from "../components/Auth/NotAuthenticatedRoute";
import AuthenticatedRoute from "../components/Auth/AuthenticatedRoute";
import AccountSettings from "../pages/UserPage/AccountSettings";
import MeLayout from "../pages/MePage/MeLayout";
import EventPage from "../pages/EventPage/EventPage";
import EventLayout from "../pages/EventPage/EventLayout";
import { loader as eventLoader } from "../pages/EventPage/EventPage";
import EventDetails from "../pages/EventPage/EventDetails";
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
      {
        path: "events",
        element: <EventLayout />,
        children: [
          {
            index: true,
            element: <EventPage />,
            loader: eventLoader,
          },
          {
            path: ":eventSlug",
            element: <EventDetails />, // Placeholder for Event Detail page
          },
        ],
      },
      {
        path: "me",
        element: (
          <AuthenticatedRoute>
            <MeLayout />
          </AuthenticatedRoute>
        ),
        children: [
          {
            path: "account-settings",
            element: <AccountSettings />,
          },
          { path: "my-tickets", element: <div>This is your ticket page</div> }, // Placeholder for My Tickets page
        ],
      },
    ],
  },
]);

export default router;
