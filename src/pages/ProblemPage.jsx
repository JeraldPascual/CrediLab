import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CodeBracketIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import CHALLENGES from "../data/challenges";

const DIFF_COLORS = {
  Easy: "bg-green-primary/10 text-green-primary",
  Medium: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  Hard: "bg-red-100 dark:bg-red-900/20 text-red-500",
};

const TIME_LIMIT = { Easy: "30 min", Medium: "60 min", Hard: "90 min" };

export default function ProblemPage() {
  const { userData, user } = useAuth();

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

  const completed  = CHALLENGES.filter((c) => completedIds.includes(c.id));
  const terminated = CHALLENGES.filter((c) => !completedIds.includes(c.id) && terminatedIds.includes(c.id));
  const ongoing    = CHALLENGES.filter((c) => !completedIds.includes(c.id) && !terminatedIds.includes(c.id) && startedIds.includes(c.id));
  const notStarted = CHALLENGES.filter((c) => !completedIds.includes(c.id) && !terminatedIds.includes(c.id) && !startedIds.includes(c.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CodeBracketIcon className="w-7 h-7 text-green-primary" />
          Challenges
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Browse, solve, and earn CLB tokens.
        </p>
      </div>

      {ongoing.length > 0 && (
        <Section icon={<ClockIcon className="w-5 h-5 text-yellow-500" />} title="In Progress" count={ongoing.length} accent="text-yellow-500">
          {ongoing.map((ch) => (
            <ChallengeCard key={ch.id} challenge={ch} state="ongoing" meta={sessionMeta[ch.id]} />
          ))}
        </Section>
      )}

      {notStarted.length > 0 && (
        <Section icon={<CodeBracketIcon className="w-5 h-5 text-green-primary" />} title="Available" count={notStarted.length} accent="text-green-primary">
          {notStarted.map((ch) => (
            <ChallengeCard key={ch.id} challenge={ch} state="notStarted" meta={sessionMeta[ch.id]} />
          ))}
        </Section>
      )}

      {completed.length > 0 && (
        <Section icon={<CheckCircleIcon className="w-5 h-5 text-green-primary" />} title="Completed" count={completed.length} accent="text-green-primary">
          {completed.map((ch) => (
            <ChallengeCard key={ch.id} challenge={ch} state="completed" meta={sessionMeta[ch.id]} />
          ))}
        </Section>
      )}

      {terminated.length > 0 && (
        <Section icon={<NoSymbolIcon className="w-5 h-5 text-red-500" />} title="Timed Out / Terminated" count={terminated.length} accent="text-red-500">
          {terminated.map((ch) => (
            <ChallengeCard key={ch.id} challenge={ch} state="terminated" meta={sessionMeta[ch.id]} />
          ))}
        </Section>
      )}

      {CHALLENGES.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-dark-muted">
          No challenges available right now.
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, count, accent, children }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className={`text-sm font-semibold uppercase tracking-wide ${accent}`}>{title}</h2>
        <span className="text-xs text-gray-400 dark:text-dark-muted font-medium">({count})</span>
        <div className="flex-1 h-px bg-gray-100 dark:bg-dark-border ml-1" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, state, meta }) {
  const isTerminated = state === "terminated";
  const isCompleted  = state === "completed";
  const isOngoing    = state === "ongoing";

  const diffBadge = (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLORS[challenge.difficulty]}`}>
      {challenge.difficulty}
    </span>
  );

  const timeLimitBadge = (
    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-surface text-gray-400 dark:text-dark-muted font-medium">
      {TIME_LIMIT[challenge.difficulty]}
    </span>
  );

  if (isTerminated) {
    const isExpired = meta?.status === "expired";
    return (
      <div className={`rounded-xl border p-5 opacity-70 cursor-not-allowed select-none ${
        isExpired
          ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800"
          : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
      }`}>
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs text-gray-400 dark:text-dark-muted">{challenge.category}</span>
          {isExpired ? (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-500">
              ⏰ Timed Out
            </span>
          ) : (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500">
              Terminated
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-400 mb-1 line-through">{challenge.title}</h3>
        <p className="text-sm text-gray-400 dark:text-dark-muted mb-3 line-clamp-2">{challenge.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {diffBadge}
            {timeLimitBadge}
          </div>
          <span className={`text-xs flex items-center gap-1 font-medium shrink-0 ${
            isExpired ? "text-orange-500" : "text-red-500"
          }`}>
            <NoSymbolIcon className="w-3.5 h-3.5" />
            {isExpired ? "Expired" : "Blocked"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/problem/${challenge.id}`}
      className={`block rounded-xl border p-5 transition-all hover:shadow-md hover:border-green-primary/40 ${
        isCompleted
          ? "bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border"
          : isOngoing
          ? "bg-yellow-50/40 dark:bg-yellow-900/5 border-yellow-200 dark:border-yellow-900/40"
          : "bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-400 dark:text-dark-muted">{challenge.category}</span>
        {isOngoing ? (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
            <ClockIcon className="w-3 h-3" /> In Progress
          </span>
        ) : (
          diffBadge
        )}
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{challenge.title}</h3>
      <p className="text-sm text-gray-500 dark:text-dark-muted mb-3 line-clamp-2">{challenge.description}</p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isOngoing && diffBadge}
          {timeLimitBadge}
          <span className="text-xs font-bold text-green-primary">+{challenge.reward} CLB</span>
        </div>

        {isCompleted ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-green-primary flex items-center gap-1 font-semibold">
              <CheckCircleIcon className="w-4 h-4" /> Done
            </span>
          </div>
        ) : (
          <span className="text-xs text-green-primary flex items-center gap-1 font-semibold shrink-0">
            {isOngoing ? "Continue" : "Solve"} <ArrowRightIcon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </Link>
  );
}
