import { useState, useEffect, useCallback } from "react";
import {
  ShieldExclamationIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import CHALLENGES from "../data/challenges";

/* ── Map challengeId → human title ── */
const TITLE_MAP = Object.fromEntries(
  CHALLENGES.map((c) => [c.id, c.title])
);

/* ── Pretty date ── */
function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(typeof ts === "number" ? ts : ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Violation type badge ── */
function ViolationBadge({ reason }) {
  const lower = (reason || "").toLowerCase();
  let label = "Other";
  let cls = "bg-gray-100 dark:bg-dark-surface text-gray-600 dark:text-dark-muted";

  if (lower.includes("tab switch") || lower.includes("focus lost")) {
    label = "Tab Switch";
    cls = "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400";
  } else if (lower.includes("right-click") || lower.includes("context")) {
    label = "Right-Click";
    cls = "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400";
  } else if (lower.includes("devtools") || lower.includes("developer")) {
    label = "DevTools";
    cls = "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  } else if (lower.includes("f12")) {
    label = "F12 Key";
    cls = "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  } else if (lower.includes("shortcut")) {
    label = "Shortcut";
    cls = "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
  } else if (lower.includes("view source")) {
    label = "View Source";
    cls = "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400";
  } else if (lower.includes("copy") || lower.includes("paste")) {
    label = "Copy/Paste";
    cls = "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
  }

  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

export default function CheatingLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    setError(null);

    try {
      // Query every individual violation from cheatLogs collection
      const q = query(
        collection(db, "cheatLogs"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setLogs(items);
    } catch (e) {
      console.error("Failed to fetch cheating logs:", e);
      setError("Failed to load cheating logs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) fetchLogs();
  }, [fetchLogs, user?.uid]);

  /* ── Group logs by challengeId ── */
  const grouped = logs.reduce((acc, log) => {
    const key = log.challengeId || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  const challengeKeys = Object.keys(grouped);

  /* ── Stats ── */
  const totalViolations = logs.length;
  const challengesAffected = challengeKeys.length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldExclamationIcon className="w-7 h-7 text-red-500" />
            Cheating Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
            Every anti-cheat violation recorded during your coding sessions.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-dark-muted hover:text-gray-800 dark:hover:text-white transition-colors disabled:opacity-40"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-1">
            Total Violations
          </p>
          <p className={`text-3xl font-bold ${totalViolations > 0 ? "text-red-500" : "text-gray-400 dark:text-dark-muted"}`}>
            {totalViolations}
          </p>
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">All-time across all challenges</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-1">
            Challenges Flagged
          </p>
          <p className={`text-3xl font-bold ${challengesAffected > 0 ? "text-orange-500" : "text-gray-400 dark:text-dark-muted"}`}>
            {challengesAffected}
          </p>
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">Unique challenges with violations</p>
        </div>
      </div>

      {/* ── Loading / Error / Empty ── */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 dark:text-dark-muted gap-2">
          <ArrowPathIcon className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading cheating logs…</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/40 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface p-12 text-center">
          <ShieldExclamationIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-dark-muted mb-3" />
          <p className="text-sm font-semibold text-gray-500 dark:text-dark-muted">No violations recorded</p>
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
            Great work! Your coding sessions are clean. Keep it up.
          </p>
        </div>
      )}

      {/* ── Grouped Violation List ── */}
      {!loading && !error && logs.length > 0 && (
        <div className="space-y-6">
          {challengeKeys.map((challengeId) => {
            const items = grouped[challengeId];
            const title = TITLE_MAP[challengeId] || challengeId;

            return (
              <div key={challengeId}>
                {/* Challenge header */}
                <div className="flex items-center gap-2 mb-2">
                  <ExclamationTriangleIcon className="w-4 h-4 text-orange-500 shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {title}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-dark-muted shrink-0">
                    {items.length} violation{items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Individual violations */}
                <div className="rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden divide-y divide-gray-100 dark:divide-dark-border">
                  {items.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
                    >
                      {/* Violation # */}
                      <div className="shrink-0 w-10 text-center">
                        <p className="text-base font-bold text-red-500">#{log.count || "?"}</p>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                          {log.reason || "Unknown violation"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">
                          {formatDate(log.timestamp)}
                        </p>
                      </div>

                      {/* Type badge */}
                      <div className="shrink-0">
                        <ViolationBadge reason={log.reason} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer note ── */}
      <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface p-4">
        <p className="text-xs text-gray-400 dark:text-dark-muted">
          🛡️ All violations are permanently recorded in Firestore and cannot be deleted or modified.
          Each coding session allows up to <strong className="text-gray-600 dark:text-dark-text">3 violations</strong> before
          automatic termination. Keep your browser focused and avoid using developer tools during challenges.
        </p>
      </div>
    </div>
  );
}
