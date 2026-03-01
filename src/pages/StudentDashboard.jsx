import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import StudentHeader from "../components/StudentHeader";
import Sidebar from "../components/Sidebar";
import CLBBalanceStrip from "../components/CLBBalanceStrip";
import MobileWarningBanner from "../components/MobileWarningBanner";

export default function StudentDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showHelpBanner, setShowHelpBanner] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  function handleSidebarNav(path) {
    navigate(path);
  }

  function closeSidebar() {
    setSidebarExpanded(false);
  }

  // Hide balance strip on pages that already show full balance details
  const hideStripPaths = ["/student/information", "/student/transactions"];
  const showStrip = !hideStripPaths.includes(location.pathname);

  return (
    <div className="h-screen bg-slate-50 dark:bg-dark-bg flex flex-col">
      {/* ── Mobile Warning ── */}
      <MobileWarningBanner />

      {/* ── Header ── */}
      <StudentHeader
        onMenuToggle={() => setSidebarExpanded((prev) => !prev)}
        sidebarExpanded={sidebarExpanded}
      />

      {/* ── Persistent CLB Balance Strip ── */}
      {showStrip && <CLBBalanceStrip />}

      <div className="flex flex-1 min-h-0 relative">
        {/* ── Sidebar (responsive: drawer on mobile, static on desktop) ── */}
        <Sidebar
          expanded={sidebarExpanded}
          onNavigate={handleSidebarNav}
          currentPath={location.pathname}
          onClose={closeSidebar}
        />

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
          {/* Help Center Banner */}
          {showHelpBanner && (
            <div className="mb-4 sm:mb-6 flex items-center gap-3 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50/80 dark:bg-blue-900/10 px-3 py-2.5 sm:px-4 sm:py-3">
              <QuestionMarkCircleIcon className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="flex-1 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                New here or feeling lost?{" "}
                <Link to="/student/help-center" className="font-semibold underline underline-offset-2 hover:text-blue-600 dark:hover:text-blue-200 transition-colors">
                  Visit the Help Center
                </Link>{" "}
                for guides on challenges, wallets, and earning CLB.
              </p>
              <button onClick={() => setShowHelpBanner(false)} className="p-1 rounded-lg text-blue-400 hover:bg-blue-200/60 dark:hover:bg-blue-800/40 transition-colors" aria-label="Dismiss">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
