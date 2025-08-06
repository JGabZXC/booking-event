import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./routes/router";
import { UserProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
