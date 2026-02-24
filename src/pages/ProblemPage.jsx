import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CodeBracketIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  NoSymbolIcon,
  FunnelIcon,
  SparklesIcon,
  BoltIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import CHALLENGES from "../data/challenges";
import { DIFF_COLORS, TIME_LIMIT_SHORT } from "../data/constants";
import { getActiveWeeklyTasks, hasCompletedWeeklyTask, getCurrentWeekNumber } from "../data/weeklyTasks";

const FILTER_TABS = ["All", "Easy", "Medium", "Hard"];

// Fixed active styles per tab — avoids the invisible Easy (green-on-green) bug
const TAB_ACTIVE_STYLES = {
  All:    "bg-green-primary text-white shadow-md shadow-green-primary/30",
  Easy:   "bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
  Medium: "bg-yellow-400 text-gray-900 shadow-md shadow-yellow-400/30",
  Hard:   "bg-red-500 text-white shadow-md shadow-red-500/30",
};

export default function ProblemPage() {
  const { userData, user } = useAuth();
  const [diffFilter, setDiffFilter] = useState("All");
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [weeklyCompletedIds, setWeeklyCompletedIds] = useState([]);
  const [weeklyLoading, setWeeklyLoading] = useState(true);

  // Load active weekly tasks from Firestore
  useEffect(() => {
    (async () => {
      try {
        const tasks = await getActiveWeeklyTasks();
        setWeeklyTasks(tasks);
        if (user) {
          const completed = await Promise.all(
            tasks.map((t) => hasCompletedWeeklyTask(user.uid, t.id))
          );
          setWeeklyCompletedIds(tasks.filter((_, i) => completed[i]).map((t) => t.id));
        }
      } catch (e) {
        console.warn("Failed to load weekly tasks:", e.message);
      } finally {
        setWeeklyLoading(false);
      }
    })();
  }, [user]);

  // Session data from localStorage (instant) + Firestore (persistent across devices)
  const [sessionData, setSessionData] = useState({ terminatedIds: [], startedIds: [], localCompletedIds: [], sessionMeta: {} });

  useEffect(() => {
    if (!user) return;

    // Step 1: Read localStorage (instant — gives local device state)
    const terminated = [];
    const started = [];
    const localCompleted = [];
    const meta = {};

    CHALLENGES.forEach((ch) => {
      const key = `challenge-session-${user.uid}-${ch.id}`;
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const session = JSON.parse(raw);
          if (session.status === "completed") {
            localCompleted.push(ch.id);
          } else if (session.status === "terminated" || session.status === "expired") {
            terminated.push(ch.id);
          } else if (session.status === "active") {
            started.push(ch.id);
          }
          meta[ch.id] = { status: session.status, timeBadge: session.timeBadge, solveTimeSec: session.solveTimeSec };
        }
      } catch { /* ignore */ }
    });

    // Step 2: Also read Firestore challengeSessions (persists across deploys/devices)
    (async () => {
      const fsTerminated = [...terminated];
      const fsStarted = [...started];
      const fsCompleted = [...localCompleted];
      const fsMeta = { ...meta };

      try {
        const sessionsRef = collection(db, "challengeSessions");
        const q = query(sessionsRef, where("uid", "==", user.uid));
        const snap = await getDocs(q);

        snap.forEach((d) => {
          const data = d.data();
          const cid = data.challengeId || d.id.replace(`${user.uid}_`, "");
          // Skip if already tracked from localStorage
          if (fsMeta[cid]) return;

          if (data.status === "completed") {
            fsCompleted.push(cid);
          } else if (data.status === "terminated" || data.status === "expired") {
            fsTerminated.push(cid);
          } else if (data.status === "active") {
            // Check if session time has expired
            const startTime = data.startedAt ? new Date(data.startedAt).getTime() : 0;
            const ch = CHALLENGES.find((c) => c.id === cid);
            const timeLimitMs = (ch?.timeLimitMin || 30) * 60 * 1000;
            if (Date.now() - startTime > timeLimitMs) {
              fsTerminated.push(cid);
              fsMeta[cid] = { status: "expired" };
            } else {
              fsStarted.push(cid);
            }
          }
          if (!fsMeta[cid]) {
            fsMeta[cid] = { status: data.status, timeBadge: data.timeBadge, solveTimeSec: data.solveTimeSec };
          }
        });
      } catch (err) {
        console.warn("Failed to load Firestore sessions:", err.message);
        // localStorage data already in arrays — graceful fallback
      }

      setSessionData({
        terminatedIds: [...new Set(fsTerminated)],
        startedIds: [...new Set(fsStarted)],
        localCompletedIds: [...new Set(fsCompleted)],
        sessionMeta: fsMeta,
      });
    })();
  }, [user]);

  const { terminatedIds, startedIds, localCompletedIds, sessionMeta } = sessionData;

  // Merge Firestore completedChallenges with localStorage status=completed (handles API failures)
  const firestoreCompletedIds = userData?.completedChallenges || [];
  const completedIds = [...new Set([...firestoreCompletedIds, ...localCompletedIds])];

  // Apply difficulty filter
  const filteredChallenges = diffFilter === "All"
    ? CHALLENGES
    : CHALLENGES.filter((c) => c.difficulty === diffFilter);

  const completed  = filteredChallenges.filter((c) => completedIds.includes(c.id));
  const terminated = filteredChallenges.filter((c) => !completedIds.includes(c.id) && terminatedIds.includes(c.id));
  const ongoing    = filteredChallenges.filter((c) => !completedIds.includes(c.id) && !terminatedIds.includes(c.id) && startedIds.includes(c.id));
  const notStarted = filteredChallenges.filter((c) => !completedIds.includes(c.id) && !terminatedIds.includes(c.id) && !startedIds.includes(c.id));

  // Stats for filter badge counts
  const countByDiff = {};
  CHALLENGES.forEach((c) => { countByDiff[c.difficulty] = (countByDiff[c.difficulty] || 0) + 1; });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ─── Weekly SDG Tasks Banner ─── */}
      <div className="rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-green-50 dark:from-emerald-950/80 dark:via-teal-900/60 dark:to-green-950/80">
        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
              <GlobeAltIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Weekly SDG Tasks</span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                  Week {getCurrentWeekNumber()}
                </span>
              </div>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70 mt-0.5">Earn bonus CLB by completing sustainable development goals</p>
            </div>
          </div>
          <SparklesIcon className="w-5 h-5 text-emerald-500/50 dark:text-emerald-400/60" />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300/60 dark:via-emerald-500/30 to-transparent mx-5" />

        {/* Task list */}
        <div className="p-4 space-y-3">
          {weeklyLoading ? (
            <div className="flex items-center gap-3 py-3">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-400/40 border-t-emerald-500 animate-spin" />
              <span className="text-xs text-emerald-600/70 dark:text-emerald-300/60">Loading this week&apos;s tasks…</span>
            </div>
          ) : weeklyTasks.length === 0 ? (
            <div className="flex items-center gap-3 py-3 text-emerald-600/60 dark:text-emerald-300/50">
              <BoltIcon className="w-4 h-4" />
              <span className="text-xs">No tasks this week — check back soon!</span>
            </div>
          ) : (
            weeklyTasks.map((task) => {
              const isDone = weeklyCompletedIds.includes(task.id);
              return (
                <Link
                  to={isDone ? "#" : `/weekly-task/${task.id}`}
                  key={task.id}
                  className={`group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                    isDone
                      ? "bg-emerald-100/70 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 opacity-70 pointer-events-none"
                      : "bg-white/70 dark:bg-white/5 border-emerald-100 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30"
                  }`}
                >
                  {/* SDG Goal badge */}
                  <div className={`shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center border text-[9px] font-black leading-none ${
                    isDone
                      ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                      : "bg-emerald-50 dark:bg-emerald-600/20 border-emerald-200 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  }`}>
                    <span className="text-[15px] leading-none">{task.sdgGoal ?? "🌱"}</span>
                    <span>SDG</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-sm font-semibold ${
                        isDone ? "text-emerald-600/70 dark:text-emerald-400/70 line-through" : "text-gray-900 dark:text-white"
                      }`}>{task.title}</span>
                      {isDone ? (
                        <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircleIcon className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <span className="shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          +{task.reward ?? 25} CLB
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 dark:text-emerald-300/60 mt-0.5 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-500/20">
                        {task.type ?? "reflection"}
                      </span>
                      {task.sdgLabel && (
                        <span className="text-[10px] text-emerald-600/60 dark:text-emerald-400/50 truncate">{task.sdgLabel}</span>
                      )}
                    </div>
                  </div>

                  {!isDone && (
                    <ArrowRightIcon className="w-4 h-4 text-emerald-400/60 dark:text-emerald-500/40 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  )}
                </Link>
              );
            })
          )}
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-2 px-5 pb-4">
          <LockClosedIcon className="w-3 h-3 text-emerald-500/50 dark:text-emerald-500/40" />
          <span className="text-[11px] text-emerald-600/50 dark:text-emerald-500/40">Tasks reset every Monday · Max 3 completions per week</span>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CodeBracketIcon className="w-7 h-7 text-green-primary" />
          Challenges
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Browse, solve, and earn CLB tokens.
        </p>
      </div>

      {/* ─── Difficulty Filter Tabs ─── */}
      <div className="flex items-center gap-2 flex-wrap">
        <FunnelIcon className="w-4 h-4 text-gray-400 dark:text-dark-muted" />
        {FILTER_TABS.map((tab) => {
          const isActive = diffFilter === tab;
          const count = tab === "All" ? CHALLENGES.length : (countByDiff[tab] || 0);
          return (
            <button
              key={tab}
              onClick={() => setDiffFilter(tab)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                isActive
                  ? TAB_ACTIVE_STYLES[tab]
                  : "bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-dark-muted hover:bg-gray-200 dark:hover:bg-dark-border"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* ─── Window Pane Tabs: Available / Completed / Timed Out ─── */}
      <ChallengePane
        ongoing={ongoing}
        notStarted={notStarted}
        completed={completed}
        terminated={terminated}
        sessionMeta={sessionMeta}
        filteredEmpty={filteredChallenges.length === 0}
        diffFilter={diffFilter}
      />
    </div>
  );
}

// ─── Window Pane Component ─────────────────────────────────────────
const PANES = [
  { key: "available", label: "Available",         icon: CodeBracketIcon,  accent: "text-green-primary",  activeClass: "border-green-primary text-green-primary" },
  { key: "completed", label: "Completed",         icon: CheckCircleIcon,  accent: "text-emerald-500",    activeClass: "border-emerald-500 text-emerald-500" },
  { key: "terminated",label: "Timed Out",         icon: NoSymbolIcon,     accent: "text-red-500",        activeClass: "border-red-500 text-red-500" },
];

function ChallengePane({ ongoing, notStarted, completed, terminated, sessionMeta, filteredEmpty, diffFilter }) {
  const [activePane, setActivePane] = useState("available");

  const availableAll = [...ongoing, ...notStarted];

  const paneItems = {
    available: availableAll,
    completed,
    terminated,
  };

  const currentItems = paneItems[activePane] ?? [];

  return (
    <div className="space-y-0">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 dark:border-dark-border">
        {PANES.map((pane) => {
          const count = paneItems[pane.key]?.length ?? 0;
          const isActive = activePane === pane.key;
          return (
            <button
              key={pane.key}
              onClick={() => setActivePane(pane.key)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                isActive
                  ? `${pane.activeClass} bg-transparent`
                  : "border-transparent text-gray-400 dark:text-dark-muted hover:text-gray-600 dark:hover:text-dark-text"
              }`}
            >
              <pane.icon className="w-3.5 h-3.5" />
              {pane.label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive
                  ? pane.key === "terminated" ? "bg-red-100 dark:bg-red-900/20 text-red-500"
                    : pane.key === "completed" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500"
                    : "bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary"
                  : "bg-gray-100 dark:bg-dark-surface text-gray-400 dark:text-dark-muted"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pane content */}
      <div className="pt-5">
        {filteredEmpty ? (
          <div className="text-center py-16 text-gray-400 dark:text-dark-muted">
            {diffFilter === "All" ? "No challenges available right now." : `No ${diffFilter} challenges available.`}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-sm text-gray-400 dark:text-dark-muted">
              {activePane === "available" && "No challenges available — all done or filtered!"}
              {activePane === "completed" && "Complete a challenge to see it here."}
              {activePane === "terminated" && "No timed out or terminated sessions."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {currentItems.map((ch) => (
              <SpotlightCard
                key={ch.id}
                challenge={ch}
                state={
                  activePane === "completed" ? "completed"
                  : activePane === "terminated" ? "terminated"
                  : ongoing.some((o) => o.id === ch.id) ? "ongoing"
                  : "notStarted"
                }
                meta={sessionMeta[ch.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Spotlight Card (Aceternity-style mouse-tracking radial gradient) ─
function SpotlightCard({ challenge, state, meta }) {
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, opacity: 0 });

  const isTerminated = state === "terminated";
  const isCompleted  = state === "completed";
  const isOngoing    = state === "ongoing";

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  }
  function handleMouseLeave() {
    setSpot((s) => ({ ...s, opacity: 0 }));
  }

  const diffBadge = (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLORS[challenge.difficulty]}`}>
      {challenge.difficulty}
    </span>
  );
  const timeLimitBadge = (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-surface text-gray-400 dark:text-dark-muted font-medium">
      {TIME_LIMIT_SHORT[challenge.difficulty]}
    </span>
  );

  // Spotlight colour per state
  const spotColor = isTerminated
    ? "rgba(239,68,68,0.08)"
    : isCompleted
    ? "rgba(16,185,129,0.07)"
    : isOngoing
    ? "rgba(234,179,8,0.08)"
    : "rgba(0,200,83,0.08)";

  const cardBase = `relative overflow-hidden rounded-xl border p-5 transition-all duration-200 ${
    isTerminated
      ? "opacity-70 cursor-not-allowed select-none bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
      : isCompleted
      ? "bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border"
      : isOngoing
      ? "bg-yellow-50/40 dark:bg-yellow-900/5 border-yellow-200 dark:border-yellow-900/40 hover:shadow-md hover:border-yellow-400/60"
      : "bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border hover:shadow-md hover:border-green-primary/40"
  }`;

  const inner = (
    <>
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-xl"
        style={{
          opacity: spot.opacity,
          background: `radial-gradient(350px circle at ${spot.x}px ${spot.y}px, ${spotColor}, transparent 80%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-gray-400 dark:text-dark-muted">{challenge.category}</span>
          {isTerminated ? (
            meta?.status === "expired" ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-500">⏰ Timed Out</span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500">Terminated</span>
            )
          ) : isOngoing ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
              <ClockIcon className="w-3 h-3" /> In Progress
            </span>
          ) : (
            diffBadge
          )}
        </div>

        <h3 className={`font-semibold mb-1 ${
          isTerminated ? "text-gray-700 dark:text-gray-400 line-through"
          : isCompleted ? "text-gray-600 dark:text-gray-300"
          : "text-gray-900 dark:text-white"
        }`}>{challenge.title}</h3>
        <p className="text-sm text-gray-500 dark:text-dark-muted mb-3 line-clamp-2">{challenge.description}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isOngoing && diffBadge}
            {!isTerminated && timeLimitBadge}
            {isTerminated ? (
              <>{diffBadge}{timeLimitBadge}</>
            ) : (
              <span className="text-xs font-bold text-green-primary">+{challenge.reward} CLB</span>
            )}
          </div>
          {isTerminated ? (
            <span className={`text-xs flex items-center gap-1 font-medium shrink-0 ${
              meta?.status === "expired" ? "text-orange-500" : "text-red-500"
            }`}>
              <NoSymbolIcon className="w-3.5 h-3.5" />
              {meta?.status === "expired" ? "Expired" : "Blocked"}
            </span>
          ) : isCompleted ? (
            <span className="text-xs text-emerald-500 flex items-center gap-1 font-semibold shrink-0">
              <CheckCircleIcon className="w-4 h-4" /> Done
            </span>
          ) : (
            <span className="text-xs text-green-primary flex items-center gap-1 font-semibold shrink-0">
              {isOngoing ? "Continue" : "Solve"} <ArrowRightIcon className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (isTerminated) {
    return (
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={cardBase}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      to={`/problem/${challenge.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cardBase}
    >
      {inner}
    </Link>
  );
}
