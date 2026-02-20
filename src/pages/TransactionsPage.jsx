import { useEffect, useState, useCallback } from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import CHALLENGES from "../data/challenges";

// Build a lookup map: challengeId → reward amount
const REWARD_MAP = Object.fromEntries(CHALLENGES.map((c) => [c.id, c.reward]));

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx/";
const PAGE_SIZE = 20;

function statusBadge(status, method) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-primary/10 text-green-primary">
        <CheckCircleIcon className="w-3.5 h-3.5" />
        Confirmed
      </span>
    );
  }
  if (status === "pending" || method === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-500">
        <ClockIcon className="w-3.5 h-3.5" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-dark-surface text-gray-500 dark:text-dark-muted">
      {status ?? "Unknown"}
    </span>
  );
}

function methodLabel(method) {
  if (method === "system_wallet") return "Auto Transfer";
  if (method === "metamask") return "MetaMask";
  if (method === "pending") return "Queued";
  if (method === "completed") return "Reward Earned";
  return method ?? "—";
}

function shortHash(hash) {
  if (!hash) return null;
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionsPage() {
  const { user, userData } = useAuth();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalEarned = userData?.totalCLBEarned ?? userData?.credits ?? 0;
  const spendable = userData?.credits ?? 0;

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Pull confirmed on-chain events from Firestore events collection
      const q = query(
        collection(db, "events"),
        where("uid", "==", user.uid),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const eventRows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Build a set of challengeIds already covered by real events
      const coveredIds = new Set(eventRows.map((r) => r.challengeId));

      // 2. Synthesize rows from completedChallenges on the user doc
      //    for any challenge that has no event record yet
      const completed = userData?.completedChallenges ?? [];
      const syntheticRows = completed
        .filter((cId) => !coveredIds.has(cId))
        .map((cId) => ({
          id: `synthetic-${cId}`,
          challengeId: cId,
          amountCLB: REWARD_MAP[cId] ?? "?",
          timestamp: userData?.lastRewardAt ?? userData?.lastCompletionAt ?? null,
          status: "success",
          method: "completed",
          txHash: null,
          blockNumber: null,
          synthetic: true,
        }));

      // 3. Merge and sort newest-first (ISO strings sort lexicographically)
      const all = [...eventRows, ...syntheticRows].sort(
        (a, b) => (b.timestamp ?? "").localeCompare(a.timestamp ?? "")
      );
      setTxs(all);
    } catch (e) {
      console.error(e);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user?.uid, userData?.completedChallenges, userData?.lastRewardAt, userData?.lastCompletionAt]);

  useEffect(() => {
    if (user?.uid) fetchTxs();
  }, [fetchTxs, user?.uid]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BanknotesIcon className="w-7 h-7 text-green-primary" />
            My Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
            All CLB rewards earned from completed challenges.
          </p>
        </div>
        <button
          onClick={fetchTxs}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-dark-muted hover:text-gray-800 dark:hover:text-white transition-colors disabled:opacity-40"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── Balance Summary ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-1">
            CLB Earned (Lifetime)
          </p>
          <p className="text-3xl font-bold text-green-primary">{totalEarned}</p>
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">Used for rank &amp; certification</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-1">
            Spendable Balance
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{spendable}</p>
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">Available to send to cafeteria</p>
        </div>
      </div>

      {/* ── Transaction List ── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
          Reward History
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-16 text-gray-400 dark:text-dark-muted gap-2">
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading transactions…</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800/40 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && txs.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface p-12 text-center">
            <BanknotesIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-dark-muted mb-3" />
            <p className="text-sm font-semibold text-gray-500 dark:text-dark-muted">No transactions yet</p>
            <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
              Complete a challenge to earn your first CLB reward.
            </p>
          </div>
        )}

        {!loading && txs.length > 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden divide-y divide-gray-100 dark:divide-dark-border">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-5 py-4 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
              >
                {/* CLB amount */}
                <div className="shrink-0 w-16 text-right">
                  <p className="text-base font-bold text-green-primary">+{tx.amountCLB}</p>
                  <p className="text-[10px] text-gray-400 dark:text-dark-muted">CLB</p>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {tx.challengeId}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-gray-400 dark:text-dark-muted">
                      {formatDate(tx.timestamp)}
                    </span>
                    <span className="text-gray-300 dark:text-dark-border text-xs">·</span>
                    <span className="text-xs text-gray-400 dark:text-dark-muted">
                      {methodLabel(tx.method)}
                    </span>
                  </div>
                </div>

                {/* Status + Etherscan link */}
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  {statusBadge(tx.status, tx.method)}
                  {tx.txHash ? (
                    <a
                      href={`${SEPOLIA_EXPLORER}${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-green-primary hover:underline"
                    >
                      {shortHash(tx.txHash)}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </a>
                  ) : tx.synthetic ? (
                    <span className="text-[11px] text-gray-400 dark:text-dark-muted">CLB logged off-chain</span>
                  ) : (
                    <span className="text-[11px] text-gray-300 dark:text-dark-border">No tx hash</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && txs.length === PAGE_SIZE && (
          <p className="text-xs text-center text-gray-400 dark:text-dark-muted mt-3">
            Showing most recent {PAGE_SIZE} transactions.
          </p>
        )}
      </div>

      {/* ── On-chain note ── */}
      <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface p-4">
        <p className="text-xs text-gray-400 dark:text-dark-muted">
          🔗 All confirmed transactions are recorded on the{" "}
          <span className="font-semibold text-gray-600 dark:text-dark-text">Sepolia testnet</span>.
          Click a transaction hash to view it on Etherscan.
          Pending transactions will be sent by the system admin shortly.
        </p>
      </div>
    </div>
  );
}
