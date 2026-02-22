import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ChevronDownIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getSkillTier } from "../data/achievements";
import { db } from "../lib/firebase";

export default function StudentHeader({ onMenuToggle, sidebarExpanded }) {
  const { user, userData, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Real-time CLB pool balance from Firestore system/credit_pool
  const [poolRemaining, setPoolRemaining] = useState(null);
  const [poolTotal, setPoolTotal] = useState(10000);

  useEffect(() => {
    const poolRef = doc(db, "system", "credit_pool");
    const unsub = onSnapshot(
      poolRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setPoolRemaining(data.remaining ?? data.total ?? 10000);
          setPoolTotal(data.total ?? 10000);
        } else {
          // Doc doesn't exist yet — no rewards distributed yet
          setPoolRemaining(10000);
          setPoolTotal(10000);
        }
      },
      () => {
        // Firestore unavailable (ad blocker etc.) — show 10,000 as fallback
        setPoolRemaining(10000);
      }
    );
    return () => unsub();
  }, []);

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

  const tier = getSkillTier(userData?.totalCLBEarned ?? userData?.credits ?? 0);

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

      {/* ── Center: Global CLB Pool ── */}
      <div className="hidden md:flex flex-1 justify-center">
        {(() => {
          const pct = poolTotal > 0 ? (poolRemaining ?? poolTotal) / poolTotal : 1;
          const isLow = pct <= 0.2;
          const isEmpty = (poolRemaining ?? poolTotal) <= 0;
          const colorClass = isEmpty
            ? "text-red-500 bg-red-500/10 border-red-500/20"
            : isLow
            ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
            : "text-green-primary bg-green-primary/10 border-green-primary/20";
          return (
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${colorClass}`}>
              <CircleStackIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">CLB Pool:</span>
              <span className="text-sm font-bold tabular-nums">
                {poolRemaining === null
                  ? "…"
                  : isEmpty
                  ? "Exhausted"
                  : poolRemaining.toLocaleString()}
              </span>
              {!isEmpty && poolRemaining !== null && (
                <span className="text-xs opacity-60">/ {poolTotal.toLocaleString()}</span>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Right: Badge + Dark Mode + User ── */}
      <div className="ml-auto flex items-center gap-3">
        {/* Student Badge */}
        <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-primary/10 text-green-primary border border-green-primary/20">
          Student
        </span>

        {/* Skill Tier Badge */}
        <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}>
          {tier.icon} {tier.shortTitle}
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
            {(userData?.photoURL || user?.photoURL) ? (
              <img
                src={userData?.photoURL || user.photoURL}
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
