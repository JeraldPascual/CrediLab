import { useState } from "react";
import {
  CheckCircleIcon,
  WalletIcon,
  CircleStackIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowTrendingUpIcon,
  CodeBracketIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import CHALLENGES from "../data/challenges";
import { shortenAddress } from "../../web3/utils/helpers";

export default function ActivitiesView() {
  const { userData } = useAuth();
  const [showWallet, setShowWallet] = useState(false);
  const [copied, setCopied] = useState(false);

  const completedIds = userData?.completedChallenges || [];
  const completed = CHALLENGES.filter((c) => completedIds.includes(c.id));
  // Use authoritative Firestore fields; fall back to computing from challenges list for legacy accounts
  const totalCLBEarned = userData?.totalCLBEarned ?? completed.reduce((sum, c) => sum + c.reward, 0);
  const spendableCredits = userData?.credits ?? totalCLBEarned;
  const totalChallenges = CHALLENGES.length;
  const progress =
    totalChallenges > 0
      ? Math.round((completed.length / totalChallenges) * 100)
      : 0;

  function handleCopy() {
    if (userData?.walletAddress) {
      navigator.clipboard.writeText(userData.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Squares2X2Icon className="w-7 h-7 text-green-primary" />
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Your progress overview and account details.
        </p>
      </div>

      {/* ── Window Panes Grid ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Pane 1: Progress */}
        <WindowPane
          title="Progress"
          icon={ArrowTrendingUpIcon}
          iconColor="text-blue-500"
        >
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {progress}%
              </span>
              <span className="text-sm text-gray-500 dark:text-dark-muted">
                {completed.length}/{totalChallenges} challenges
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2.5">
              <div
                className="bg-green-primary h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </WindowPane>

        {/* Pane 2: Completed */}
        <WindowPane
          title="Completed"
          icon={CheckCircleIcon}
          iconColor="text-green-primary"
        >
          <div className="space-y-3">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {completed.length}
            </span>
            {completed.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {completed.slice(0, 5).map((ch) => (
                  <span
                    key={ch.id}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-green-primary/10 text-green-primary font-medium truncate max-w-[120px]"
                  >
                    {ch.title}
                  </span>
                ))}
                {completed.length > 5 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-border text-gray-500 dark:text-dark-muted font-medium">
                    +{completed.length - 5} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-dark-muted">
                No challenges completed yet.
              </p>
            )}
          </div>
        </WindowPane>

        {/* Pane 3: Credits Earned */}
        <WindowPane
          title="Credits Earned"
          icon={CircleStackIcon}
          iconColor="text-yellow-500"
        >
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {totalCLBEarned}
              </span>
              <span className="text-sm font-semibold text-green-primary">
                CLB
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-dark-muted">
              Lifetime earned — used for rank &amp; certification.
            </p>
            {spendableCredits !== totalCLBEarned && (
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                Spendable balance:{" "}
                <span className="font-semibold text-green-primary">{spendableCredits} CLB</span>
              </p>
            )}
          </div>
        </WindowPane>

        {/* Pane 4: Wallet Address */}
        <WindowPane
          title="Wallet Address"
          icon={WalletIcon}
          iconColor="text-purple-500"
        >
          {userData?.walletAddress ? (
            <div className="space-y-3">
              {showWallet ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-gray-700 dark:text-dark-text truncate flex-1">
                    {userData.walletAddress}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors flex-shrink-0"
                    title="Copy address"
                  >
                    {copied ? (
                      <CheckIcon className="w-4 h-4 text-green-primary" />
                    ) : (
                      <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ) : (
                <span className="text-sm font-mono text-gray-500 dark:text-dark-muted">
                  {shortenAddress(userData.walletAddress)} ••••••••
                </span>
              )}
              <button
                onClick={() => setShowWallet(!showWallet)}
                className="flex items-center gap-1.5 text-xs font-medium text-green-primary hover:underline"
              >
                {showWallet ? (
                  <>
                    <EyeSlashIcon className="w-3.5 h-3.5" /> Hide address
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-3.5 h-3.5" /> Reveal address
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-dark-muted">
                No wallet connected.
              </p>
              <p className="text-xs text-gray-400 dark:text-dark-muted">
                Connect in{" "}
                <span className="text-green-primary font-medium">
                  My Account
                </span>{" "}
                to receive CLB tokens.
              </p>
            </div>
          )}
        </WindowPane>
      </div>

      {/* ── Recent Completions ── */}
      {completed.length > 0 && (
        <WindowPane
          title="Recent Completions"
          icon={CodeBracketIcon}
          iconColor="text-green-primary"
          fullWidth
        >
          <div className="divide-y divide-gray-100 dark:divide-dark-border">
            {completed.slice(0, 5).map((ch) => (
              <div
                key={ch.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-4 h-4 text-green-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {ch.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-dark-muted">
                      {ch.category} · {ch.difficulty}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-primary">
                  +{ch.reward} CLB
                </span>
              </div>
            ))}
          </div>
        </WindowPane>
      )}
    </div>
  );
}

/* ── Window Pane Component ── */
function WindowPane({
  title,
  icon: Icon,
  iconColor,
  children,
  fullWidth = false,
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      {/* Title bar (window-like) */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wide">
            {title}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-5">{children}</div>
    </div>
  );
}
