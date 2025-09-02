import { useState } from "react";
import { Link } from "react-router-dom";

export default function DesktopDropDown() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button
        type="button"
        className="rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
        id="user-menu-button"
        aria-expanded={showDropdown}
        // data-dropdown-toggle="user-dropdown"
        // data-dropdown-placement="bottom"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <span className="sr-only">Open user menu</span>
        Admin
      </button>
      <div
        className={`absolute right-0 mt-2 z-50 ${
          showDropdown ? "block" : "hidden"
        } w-56 text-base list-none bg-white divide-y divide-pink-100 rounded-lg shadow-sm dark:bg-pink-900 dark:divide-pink-800`}
        id="user-dropdown"
      >
        <div className="px-4 py-3">
          <span className="block text-sm text-gray-900 dark:text-white"></span>
          <span className="block text-sm  text-gray-500 truncate dark:text-gray-300"></span>
        </div>
        <ul className="py-2" aria-labelledby="user-menu-button">
          <li>
            <Link
              to="/me/my-tickets"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
              onClick={() => setShowDropdown(false)}
            >
              Payments
            </Link>
          </li>
          <li>
            <Link
              to="/admin/check-user"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
              onClick={() => setShowDropdown(false)}
            >
              User
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
