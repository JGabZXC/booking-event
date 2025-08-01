import { Link } from "react-router-dom";

export default function MobileMenu({ menuOpen, user, handleLogout }) {
  return (
    <div
      className={`sm:hidden ${menuOpen ? "block" : "hidden"}`}
      id="mobile-menu"
    >
      <div className="space-y-1 px-2 pt-2 pb-3">
        <Link
          to=""
          className="block rounded-md bg-pink-900 px-3 py-2 text-sm font-medium text-white"
        >
          Home
        </Link>
        <Link
          to=""
          className="block rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
        >
          Events
        </Link>
        <Link
          to=""
          className="block rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
        >
          Projects
        </Link>
        {user ? (
          <button
            onClick={handleLogout}
            className="block rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white w-full text-left"
          >
            Log out
          </button>
        ) : (
          <Link
            to="login"
            className="block rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  );
}
