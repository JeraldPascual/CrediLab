import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import Sidebar from "../components/Sidebar";
import CLBBalanceStrip from "../components/CLBBalanceStrip";
import MobileWarningBanner from "../components/MobileWarningBanner";

export default function StudentDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleSidebarNav(path) {
    navigate(path);
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

      <div className="flex flex-1 min-h-0">
        {/* ── Sidebar ── */}
        <Sidebar
          expanded={sidebarExpanded}
          onNavigate={handleSidebarNav}
          currentPath={location.pathname}
        />

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
