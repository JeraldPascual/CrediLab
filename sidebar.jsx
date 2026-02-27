import {
  ClipboardDocumentListIcon,
  TrophyIcon,
  CodeBracketIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  BanknotesIcon,
  GlobeAltIcon,
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
    label: "Help Center",
    path: "/student/help-center",
    icon: QuestionMarkCircleIcon,
  },
];

export default function Sidebar({ expanded = true, onNavigate, currentPath }) {
  return (
    <aside
      className={`
        bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border
        transition-all duration-200 ease-in-out
        ${expanded ? "w-64" : "w-20"}
        flex flex-col flex-shrink-0
      `}
    >
        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.path === "/student"
                ? currentPath === "/student"
                : currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                title={!expanded ? item.label : ""}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${!expanded ? "justify-center" : ""}
                  ${
                    active
                      ? "bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary"
                      : "text-gray-600 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {expanded && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-100 dark:border-dark-border p-4">
          {expanded && (
            <div className="text-xs text-gray-400 dark:text-dark-muted text-center">
              CrediLab v1.0.0
            </div>
          )}
        </div>
      </aside>
  );
}
