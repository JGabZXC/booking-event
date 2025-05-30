import { Outlet } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import Footer from "../components/Navigation/Footer";

export default function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main>
        <div className="max-w-[80rem] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
