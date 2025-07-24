import { Outlet } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import Footer from "../components/Navigation/Footer";
import { ToastContainer, Bounce } from "react-toastify";

export default function RootLayout() {
  return (
    <>
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
      <main>
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
