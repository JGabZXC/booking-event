import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@headlessui/react";
import { Link } from "react-router-dom";
export default function DesktopMenu({
  menuOpen,
  setMenuOpen,
  logo,
  handleLogout,
}) {
  const { user } = useContext(AuthContext);
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
            <button
              onClick={handleLogout}
              className="rounded-md px-3 py-2 text-sm font-medium border border-pink-900 text-pink-900 hover:bg-pink-900 hover:text-white"
            >
              Log out
            </button>
          ) : (
            <Link
              to="login"
              className="rounded-md px-3 py-2 text-sm font-medium border border-pink-900 text-pink-900 hover:bg-pink-900 hover:text-white"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
