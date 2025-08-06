import { Outlet } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import Footer from "../components/Navigation/Footer";
import { ToastContainer, Bounce } from "react-toastify";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
      <MainNavigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
