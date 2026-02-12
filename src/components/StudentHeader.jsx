import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function StudentHeader({ onMenuToggle, sidebarExpanded }) {
  const { user, userData, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const displayName =
    userData?.displayName || user?.displayName || user?.email || "Student";

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center px-4 md:px-6 gap-4">
      {/* ── Hamburger ── */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarExpanded ? (
          <XMarkIcon className="w-6 h-6 text-gray-700 dark:text-dark-text" />
        ) : (
          <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-dark-text" />
        )}
      </button>

      {/* ── Logo ── */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-green-primary">CrediLab</span>
        <span className="hidden sm:inline text-xs text-gray-400 dark:text-dark-muted">
          Learn to earn.
        </span>
      </div>

      {/* ── Center: User CLB Balance ── */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-primary/10 border border-green-primary/20">
          <span className="text-sm font-semibold text-green-primary">🪙</span>
          <span className="text-sm font-semibold text-green-primary">
            My CLB:
          </span>
          <span className="text-sm font-bold text-green-primary">
            {userData?.credits ?? 0}
          </span>
        </div>
      </div>

      {/* ── Right: Badge + Dark Mode + User ── */}
      <div className="ml-auto flex items-center gap-3">
        {/* Student Badge */}
        <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-primary/10 text-green-primary border border-green-primary/20">
          Student
        </span>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover border-2 border-green-primary/30"
              />
            ) : (
              <UserCircleIcon className="w-8 h-8 text-gray-400 dark:text-dark-muted" />
            )}
            <ChevronDownIcon className="w-3 h-3 text-gray-400 dark:text-dark-muted" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg py-2 z-50">
              {/* User info */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-dark-border">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-400 dark:text-dark-muted truncate">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/student/information");
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
              >
                My Account
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
