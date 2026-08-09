import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppDispatch, useAppSelector } from "../../lib/hook";
import { setLogout } from "../../features/auth/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate, useLocation } from "react-router";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function NavbarComponent() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = useAppSelector((state) => state.auth.user);
  const count = useAppSelector((state) => state.cart?.totalItems || 0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(setLogout());
      toast.info("Logged out successfully!");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to sign out");
    }
  };

  return (
    <Disclosure as="nav" className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-800 hover:text-white focus:outline-none">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo & Navigation Links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                F
              </div>
              <span className="text-xl font-bold text-white tracking-wide hidden sm:block">
                Found<span className="text-blue-500">Store</span>
              </span>
            </Link>

            <div className="hidden sm:ml-8 sm:block">
              <div className="flex space-x-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        isActive
                          ? "bg-slate-800 text-blue-400"
                          : "text-gray-300 hover:bg-slate-800/60 hover:text-white"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right section: Cart & Profile */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Shopping Cart Icon */}
            <Link
              to="/dashboard"
              className="relative p-2 text-gray-300 hover:text-white transition flex items-center justify-center"
              title="View Cart / Dashboard"
            >
              <span className="text-xl">🛒</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                  {count}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <Menu as="div" className="relative ml-2">
                <MenuButton className="relative flex rounded-full ring-2 ring-blue-500/50 hover:ring-blue-400 focus:outline-none transition p-0.5 cursor-pointer">
                  <img
                    alt={user.displayName || "User profile"}
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || "User"
                      )}&background=1a73e8&color=fff`
                    }
                    className="w-9 h-9 rounded-full object-cover shadow"
                  />
                </MenuButton>

                {/* Google Account Styled Dropdown */}
                <MenuItems
                  transition
                  className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none divide-y divide-gray-100 overflow-hidden"
                >
                  {/* Google Profile Card Header */}
                  <div className="p-5 text-center bg-gradient-to-b from-blue-50/50 to-white">
                    <div className="relative inline-block mb-3">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName || "User"
                          )}&background=1a73e8&color=fff`
                        }
                        alt="Profile avatar"
                        className="w-16 h-16 rounded-full mx-auto object-cover ring-4 ring-white shadow-md"
                      />
                      {user.authProvider === "google" && (
                        <div
                          className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow"
                          title="Signed in with Google"
                        >
                          <img
                            src="https://www.svgrepo.com/show/355037/google.svg"
                            alt="Google logo"
                            className="w-4 h-4"
                          />
                        </div>
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-900 text-base leading-tight truncate">
                      {user.displayName || "Google Account User"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>

                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user.authProvider === "google" ? "Google Account" : "Email Account"}
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-2 px-2 space-y-1">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            active ? "bg-gray-100 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Your Google Profile
                        </Link>
                      )}
                    </MenuItem>

                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                            active ? "bg-gray-100 text-blue-600" : "text-gray-700"
                          }`}
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Dashboard
                        </Link>
                      )}
                    </MenuItem>
                  </div>

                  {/* Sign Out Button */}
                  <div className="py-2 px-2">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                            active ? "bg-red-50 text-red-700" : "text-red-600 bg-gray-50 hover:bg-red-50"
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth/login"
                  className="text-gray-300 hover:text-white font-medium text-sm transition px-3 py-1.5"
                >
                  Log in
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-xl transition shadow-md hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <DisclosurePanel className="sm:hidden border-t border-slate-800">
        <div className="space-y-1 px-3 pt-2 pb-4">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              to={item.href}
              className="block rounded-lg px-3 py-2 text-base font-medium text-gray-300 hover:bg-slate-800 hover:text-white"
            >
              {item.name}
            </DisclosureButton>
          ))}
          {user && (
            <DisclosureButton
              as={Link}
              to="/profile"
              className="block rounded-lg px-3 py-2 text-base font-medium text-blue-400 hover:bg-slate-800"
            >
              Your Profile
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
