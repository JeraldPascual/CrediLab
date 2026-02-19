import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import Sidebar from "../components/Sidebar";

export default function StudentDashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function handleSidebarNav(path) {
    navigate(path);
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-dark-bg flex flex-col">
      {/* ── Header ── */}
      <StudentHeader
        onMenuToggle={() => setSidebarExpanded((prev) => !prev)}
        sidebarExpanded={sidebarExpanded}
      />

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
