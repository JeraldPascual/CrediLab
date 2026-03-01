import {
  ClipboardDocumentListIcon,
  TrophyIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  BanknotesIcon,
  GlobeAltIcon,
  ShieldExclamationIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/student",
    icon: ClipboardDocumentListIcon,
  },
  {
    label: "Challenges",
    path: "/problem",
    icon: CodeBracketIcon,
  },
  {
    label: "Community",
    path: "/student/community",
    icon: GlobeAltIcon,
  },
  {
    label: "Leaderboard",
    path: "/student/leaderboard",
    icon: TrophyIcon,
  },
  {
    label: "Achievements",
    path: "/student/achievements",
    icon: SparklesIcon,
  },
  {
    label: "Transactions",
    path: "/student/transactions",
    icon: BanknotesIcon,
  },
  {
    label: "Cheating Logs",
    path: "/student/cheating-logs",
    icon: ShieldExclamationIcon,
  },
  {
    label: "Help Center",
    path: "/student/help-center",
    icon: QuestionMarkCircleIcon,
  },
];

export default function Sidebar({ expanded = true, onNavigate, currentPath, onClose }) {
  return (
    <>
      {/* ── Mobile overlay backdrop ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border
          transition-all duration-200 ease-in-out flex flex-col shrink-0

          /* ── Mobile: slide-in drawer ── */
          fixed inset-y-0 left-0 z-50 w-64
          ${expanded ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto

          /* ── Desktop: collapsible sidebar ── */
          ${expanded ? "md:w-64" : "md:w-20"}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-3 md:hidden">
          <span className="text-lg font-bold text-green-primary">CrediLab</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active =
              item.path === "/student"
                ? currentPath === "/student"
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  // Auto-close on mobile after navigation
                  if (window.innerWidth < 768 && onClose) onClose();
                }}
                title={!expanded ? item.label : ""}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${!expanded ? "md:justify-center" : ""}
                  ${
                    active
                      ? "bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary"
                      : "text-gray-600 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {/* Always show label on mobile; respect expanded on desktop */}
                <span className={`md:${expanded ? "inline" : "hidden"}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-100 dark:border-dark-border p-4">
          <div className="text-xs text-gray-400 dark:text-dark-muted text-center">
            CrediLab v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
}
