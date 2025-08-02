import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";
export default function DesktopMenu({
  menuOpen,
  setMenuOpen,
  logo,
  handleLogout,
  showDropdown,
  setShowDropdown,
}) {
  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <div className="mx-auto max-w-[80rem] px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <Button
            type="button"
            className="relative inline-flex items-center justify-center rounded-md p-2 text-pink-900 hover:bg-pink-900 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
            <svg
              className={`size-6 ${menuOpen ? "hidden" : "block"}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              className={`size-6 ${menuOpen ? "block" : "hidden"}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center">
            <img className="h-8 w-auto" src={logo} alt="ShowUp Logo" />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <Link
                to=""
                className="rounded-md bg-pink-900 px-3 py-2 text-sm font-medium text-white"
                // aria-current="page"
              >
                Home
              </Link>
              <Link
                to=""
                className="rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
              >
                Events
              </Link>
              <Link
                to=""
                className="rounded-md px-3 py-2 text-sm font-medium text-pink-900 hover:bg-pink-700 hover:text-white"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute hidden inset-y-0 right-0 sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {user ? (
            <div className="relative md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="flex text-sm bg-pink-900 rounded-full md:me-00"
                id="user-menu-button"
                aria-expanded={showDropdown}
                // data-dropdown-toggle="user-dropdown"
                // data-dropdown-placement="bottom"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="w-8 h-8 text-white" />
              </button>
              <div
                className={`absolute right-0 mt-2 z-50 ${
                  showDropdown ? "block" : "hidden"
                } w-56 text-base list-none bg-white divide-y divide-pink-100 rounded-lg shadow-sm dark:bg-pink-900 dark:divide-pink-800`}
                id="user-dropdown"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {user.name}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-300">
                    {user.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
                    >
                      My Tickets
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
                    >
                      Account Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-100 dark:hover:bg-pink-600 dark:text-pink-200 dark:hover:text-white"
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
              className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium border border-pink-900 text-pink-900 hover:bg-pink-900 hover:text-white"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
