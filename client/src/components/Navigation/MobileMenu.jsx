import { Link, NavLink } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function MobileMenu({
  menuOpen,
  user,
  handleLogout,
  showDropdown,
  setShowDropdown,
}) {
  return (
    <div
      className={`sm:hidden ${menuOpen ? "block" : "hidden"}`}
      id="mobile-menu"
    >
      <div className="space-y-1 px-2 pt-2 pb-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "block rounded-md bg-pink-900 px-3 py-2 text-sm font-medium text-white"
              : "block rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/events?sort=date&type=asc&page=1&limit=10"
          className={({ isActive }) =>
            isActive
              ? "block rounded-md bg-pink-900 px-3 py-2 text-sm font-medium text-white"
              : "block rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
          }
        >
          Events
        </NavLink>
        {user ? (
          <div className="relative md:order-2 px-2 pt-2 pb-3">
            <button
              type="button"
              className="flex items-center gap-2 text-sm bg-pink-900 rounded-full md:me-0"
              id="user-menu-button"
              aria-expanded={showDropdown}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              <span className="sr-only">Open user menu</span>
              <UserCircleIcon className="w-8 h-8 text-white" />
            </button>
            <div
              className={`${
                showDropdown ? "block" : "hidden"
              } mt-2 w-full text-base list-none bg-white divide-y divide-pink-100 rounded-lg shadow-sm dark:bg-pink-900 dark:divide-pink-800`}
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-300">
                  {user.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <Link
                    to="/me/my-tickets"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Tickets
                  </Link>
                </li>
                <li>
                  <Link
                    to="/me/account-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
                    onClick={() => setShowDropdown(false)}
                  >
                    Account Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
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
