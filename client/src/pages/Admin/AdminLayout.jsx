import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <section className="max-w-[80rem] mx-auto my-5 px-2 sm:px-6 lg:px-8">
      <Outlet />
    </section>
  );
}
