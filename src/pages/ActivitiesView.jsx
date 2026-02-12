import { Link } from "react-router-dom";
import {
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import CHALLENGES from "../data/challenges";
import { shortenAddress } from "../../web3/utils/helpers";

export default function ActivitiesView() {
  const { userData } = useAuth();

  const completedIds = userData?.completedChallenges || [];
  const available = CHALLENGES.filter((c) => !completedIds.includes(c.id));
  const completed = CHALLENGES.filter((c) => completedIds.includes(c.id));
  const creditsEarned = completed.reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Activities
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Browse available challenges and track your progress.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Available" value={available.length} color="blue" />
        <StatCard label="Completed" value={completed.length} color="green" />
        <StatCard
          label="Credits Earned"
          value={`${creditsEarned} CLB`}
          color="yellow"
        />
        <StatCard
          label="Wallet"
          value={userData?.walletAddress ? shortenAddress(userData.walletAddress) : "—"}
          color="purple"
          subtitle={!userData?.walletAddress ? "Connect in Profile" : "Connected"}
        />
      </div>

      {/* Available challenges */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-blue-500" />
          Available Challenges ({available.length})
        </h2>
        {available.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {available.map((ch) => (
              <ChallengeCard key={ch.id} challenge={ch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 dark:text-dark-muted">
            🎉 You&apos;ve completed all available challenges!
          </div>
        )}
      </section>

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-primary" />
            Completed ({completed.length})
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {completed.map((ch) => (
              <ChallengeCard key={ch.id} challenge={ch} completed />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, color, subtitle }) {
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400",
    green:
      "bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400",
    yellow:
      "bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400",
    purple:
      "bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div
      className={`rounded-xl p-4 ${colorMap[color]} border border-transparent`}
    >
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtitle && <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function ChallengeCard({ challenge, completed = false }) {
  const diffColors = {
    Easy: "bg-green-primary/10 text-green-primary",
    Medium:
      "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    Hard: "bg-red-100 dark:bg-red-900/20 text-red-500",
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all hover:shadow-md ${
        completed
          ? "bg-gray-50 dark:bg-dark-card border-gray-200 dark:border-dark-border opacity-75"
          : "bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffColors[challenge.difficulty]}`}
          >
            {challenge.difficulty}
          </span>
          <span className="text-xs text-gray-400 dark:text-dark-muted">
            {challenge.category}
          </span>
        </div>
        <span className="text-sm font-bold text-green-primary">
          +{challenge.reward} CLB
        </span>
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {challenge.title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-dark-muted mb-4">
        {challenge.description}
      </p>

      {completed ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-primary">
          <CheckCircleIcon className="w-4 h-4" />
          Completed
        </span>
      ) : (
        <Link
          to={`/problem/${challenge.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-green-primary hover:underline"
        >
          Start Challenge
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
