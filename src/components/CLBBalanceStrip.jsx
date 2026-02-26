import { useAuth } from "../context/AuthContext";
import { CircleStackIcon } from "@heroicons/react/24/outline";

/**
 * Persistent CLB Balance Strip — shown on every /student/* page
 * Sits between the header and main content area in StudentDashboard.
 *
 * Displays:
 *  - Challenge Rewards: cumulative CLB earned from coding challenges
 *  - Balance: total spendable CLB (quiz + received − sent)
 *
 * Both values come from userData (real-time Firestore onSnapshot via AuthContext).
 */
export default function CLBBalanceStrip() {
  const { userData } = useAuth();

  const totalEarned = userData?.totalCLBEarned ?? userData?.credits ?? 0;
  const spendable = userData?.credits ?? 0;
  const quizRewards = userData?.quizCredits ?? totalEarned;

  // If no data yet (loading), show skeleton
  if (!userData) {
    return (
      <div className="w-full border-b border-gray-100 dark:border-dark-border bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm px-6 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-dark-border rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-dark-border rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-gray-100 dark:border-dark-border bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm px-6 py-2">
      <div className="max-w-5xl mx-auto flex items-center gap-6 flex-wrap">
        {/* Challenge Rewards */}
        <div className="flex items-center gap-1.5">
          <CircleStackIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-medium text-gray-500 dark:text-dark-muted">
            Challenge Rewards
          </span>
          <span className="text-xs font-bold text-emerald-500 tabular-nums">
            {quizRewards} CLB
          </span>
        </div>

        <span className="text-gray-200 dark:text-dark-border">|</span>

        {/* Spendable Balance */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-gray-500 dark:text-dark-muted">
            Balance
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
            {spendable} CLB
          </span>
          {spendable !== totalEarned && (
            <span className="text-[10px] text-gray-400 dark:text-dark-muted">
              ({totalEarned} earned)
            </span>
          )}
        </div>

        {/* Wallet status indicator */}
        {userData?.walletAddress ? (
          <div className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-gray-400 dark:text-dark-muted">Wallet linked</span>
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] text-amber-500">No wallet</span>
          </div>
        )}
      </div>
    </div>
  );
}
