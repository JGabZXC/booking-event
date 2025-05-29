import { Outlet } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";

export default function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main className="p-4">
        <div className="max-w-[80rem] mx-auto">
          <Outlet />
        </div>
      </main>
    </>
  );
}
