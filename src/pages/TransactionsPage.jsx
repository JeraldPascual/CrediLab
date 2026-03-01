import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import CHALLENGES from "../data/challenges";
import { getCLBBalance } from "../../web3/contracts/clbToken";

// Build a lookup map: challengeId → reward amount
const REWARD_MAP = Object.fromEntries(CHALLENGES.map((c) => [c.id, c.reward]));

const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/tx/";
const PAGE_SIZE = 20;

function statusBadge(status, method) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary border border-emerald-200 dark:border-transparent">
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
  const navigate = useNavigate();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On-chain balance
  const [onChainBalance, setOnChainBalance] = useState(null);
  const [loadingChain, setLoadingChain] = useState(false);

  const totalEarned = userData?.totalCLBEarned ?? userData?.credits ?? 0;
  const spendable = userData?.credits ?? 0;
  const walletAddress = userData?.walletAddress;

  // Fetch on-chain CLB balance
  useEffect(() => {
    async function fetchOnChain() {
      if (!walletAddress) { setOnChainBalance(null); return; }
      setLoadingChain(true);
      try {
        const bal = await getCLBBalance(walletAddress);
        setOnChainBalance(bal);
      } catch (e) {
        console.error("[Transactions] On-chain balance error:", e.message);
        setOnChainBalance(null);
      } finally {
        setLoadingChain(false);
      }
    }
    fetchOnChain();
  }, [walletAddress]);

  const fetchTxs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Pull confirmed on-chain events from Firestore events collection
      const q = query(
        collection(db, "events"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc"),
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

      {/* ── Claim CLB Banner ── */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10">
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-orange-800 dark:text-orange-300">CLB not reflected in your wallet?</p>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">
              If a completed challenge or task reward didn't transfer on-chain, use the <strong>Claim CLB</strong> button on your account page to trigger it manually.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/student/information")}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
        >
          Go to My Account
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── On-Chain Balance & Mismatch ── */}
      {walletAddress && (
        <div className={`rounded-xl border p-5 ${
          onChainBalance !== null && Math.abs(Number(onChainBalance) - spendable) > 0.01
            ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50/50 dark:bg-yellow-900/10"
            : "border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card"
        }`}>
          <div className="flex items-start gap-3">
            {onChainBalance !== null && Math.abs(Number(onChainBalance) - spendable) > 0.01 && (
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-dark-muted mb-1">
                    On-Chain CLB Balance (Sepolia)
                  </p>
                  {loadingChain ? (
                    <p className="text-lg font-bold text-gray-400">Loading…</p>
                  ) : onChainBalance !== null ? (
                    <p className="text-2xl font-bold text-green-primary">{Number(onChainBalance).toFixed(2)} CLB</p>
                  ) : (
                    <p className="text-lg font-bold text-gray-400">Unavailable</p>
                  )}
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${walletAddress}#tokentxns`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-primary hover:underline flex items-center gap-1"
                >
                  View on Etherscan
                  <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                </a>
              </div>

              {/* Mismatch explanation */}
              {onChainBalance !== null && Math.abs(Number(onChainBalance) - spendable) > 0.01 && (
                <div className="space-y-2 pt-2 border-t border-yellow-200 dark:border-yellow-800/40">
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                    ⚠ Balance Mismatch Detected
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 dark:text-dark-muted">Firestore (App)</span>
                      <p className="font-bold text-gray-800 dark:text-white">{spendable} CLB</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 dark:text-dark-muted">On-Chain (Sepolia)</span>
                      <p className="font-bold text-green-primary">{Number(onChainBalance).toFixed(2)} CLB</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-dark-muted leading-relaxed">
                    This can happen for several reasons: <strong>1)</strong> An on-chain transfer completed
                    but Firestore wasn't updated (network timing). <strong>2)</strong> CLB was sent or received
                    directly via MetaMask outside of CrediLab. <strong>3)</strong> A pending reward hasn't been
                    claimed yet — click your <strong>avatar in the top-right header → My Account</strong>, scroll to
                    <strong> Wallet Connection</strong>, and click <strong>Claim CLB</strong>.
                    The on-chain balance is the source of truth for your actual token holdings.
                  </p>
                </div>
              )}

              {onChainBalance !== null && Math.abs(Number(onChainBalance) - spendable) <= 0.01 && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 pt-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  On-chain balance matches your app balance.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

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
