import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CodeBracketIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import CHALLENGES, { getChallengeById } from "../data/challenges";

export default function ProblemPage() {
  const { challengeId } = useParams();
  const { userData } = useAuth();
  const [tab, setTab] = useState("ongoing");

  const completedIds = userData?.completedChallenges || [];

  // If a specific challenge is selected, show detail view
  if (challengeId) {
    const challenge = getChallengeById(challengeId);
    if (!challenge)
      return (
        <div className="max-w-3xl mx-auto py-12 text-center">
          <p className="text-gray-500 dark:text-dark-muted">
            Challenge not found.
          </p>
          <Link
            to="/problem"
            className="text-green-primary hover:underline text-sm mt-2 inline-block"
          >
            ← Back to challenges
          </Link>
        </div>
      );
    return <ChallengeDetail challenge={challenge} isCompleted={completedIds.includes(challenge.id)} />;
  }

  // Tab filtering
  const ongoing = CHALLENGES.filter((c) => !completedIds.includes(c.id));
  const completed = CHALLENGES.filter((c) => completedIds.includes(c.id));
  const displayed = tab === "ongoing" ? ongoing : completed;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CodeBracketIcon className="w-7 h-7 text-green-primary" />
          Challenges
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Browse, solve, and earn CLB tokens.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-dark-surface rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("ongoing")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "ongoing"
              ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-dark-text"
          }`}
        >
          <ClockIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Ongoing ({ongoing.length})
        </button>
        <button
          onClick={() => setTab("completed")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "completed"
              ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-dark-text"
          }`}
        >
          <CheckCircleIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Completed ({completed.length})
        </button>
      </div>

      {/* Challenge List */}
      {displayed.length === 0 ? (
        <div className="text-center py-12 text-gray-400 dark:text-dark-muted">
          {tab === "completed"
            ? "No completed challenges yet. Start solving!"
            : "No challenges available right now."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {displayed.map((ch) => (
            <ChallengeListCard
              key={ch.id}
              challenge={ch}
              completed={tab === "completed"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Challenge list card ── */
function ChallengeListCard({ challenge, completed }) {
  const diffColors = {
    Easy: "bg-green-primary/10 text-green-primary",
    Medium: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    Hard: "bg-red-100 dark:bg-red-900/20 text-red-500",
  };

  return (
    <Link
      to={`/problem/${challenge.id}`}
      className={`block rounded-xl border p-5 transition-all hover:shadow-md hover:border-green-primary/40 ${
        completed
          ? "bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border opacity-75"
          : "bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-400 dark:text-dark-muted">
          {challenge.category}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffColors[challenge.difficulty]}`}
        >
          {challenge.difficulty}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {challenge.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-dark-muted mb-3 line-clamp-2">
        {challenge.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-green-primary">
          +{challenge.reward} CLB
        </span>
        {completed && (
          <span className="text-xs text-green-primary flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" /> Done
          </span>
        )}
      </div>
    </Link>
  );
}

/* ── Challenge Detail View (placeholder for code editor) ── */
function ChallengeDetail({ challenge, isCompleted }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/problem"
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-dark-muted hover:text-green-primary transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to challenges
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {challenge.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
            {challenge.category} · {challenge.difficulty}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="px-3 py-1.5 rounded-lg bg-green-primary/10 text-green-primary font-semibold text-xs flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" /> Completed
            </span>
          )}
          <span className="px-3 py-1.5 rounded-lg bg-green-primary/10 text-green-primary font-bold text-sm">
            +{challenge.reward} CLB
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-2">
          Problem Description
        </h2>
        <p className="text-gray-600 dark:text-dark-muted leading-relaxed whitespace-pre-wrap">
          {challenge.instructions || challenge.description}
        </p>
      </div>

      {/* Code Editor placeholder — shows starter code */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
          <span className="text-sm font-medium text-gray-700 dark:text-dark-text font-mono">
            Main.java
          </span>
          <span className="text-xs text-gray-400 dark:text-dark-muted">
            Java ({challenge.difficulty})
          </span>
        </div>
        <pre className="p-6 text-sm font-mono text-gray-300 dark:text-dark-muted bg-gray-900 dark:bg-[#0d1117] overflow-x-auto min-h-[200px]">
          <code>{challenge.starterCode}</code>
        </pre>
      </div>

      {/* Submit button */}
      <div className="flex justify-end">
        <button
          disabled
          className="px-6 py-3 rounded-lg bg-green-primary text-dark-bg font-semibold opacity-50 cursor-not-allowed"
        >
          Submit Solution (code editor coming soon)
        </button>
      </div>
    </div>
  );
}
