import { useState, useEffect, useCallback } from "react";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  FunnelIcon,
  CheckBadgeIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon as ThumbUpSolid } from "@heroicons/react/24/solid";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { SDG_ICONS, SDG_GOALS } from "../data/weeklyTasks";

/**
 * Community Feed — /student/community
 *
 * Reddit-style upvote/downvote feed for weekly SDG task submissions.
 * Replaces admin approval — community validates submissions via votes.
 *
 * Voting rules:
 *   - Each user gets ONE vote per submission (up or down, can toggle)
 *   - Net score (upvotes − downvotes) determines visibility & validity
 *   - Submissions with ≥3 net upvotes are marked "community_approved"
 *   - Submissions with ≤ −3 net downvotes are flagged for review
 *
 * Firestore fields added to weekly_completions docs:
 *   upvotes:    number (count)
 *   downvotes:  number (count)
 *   upvoters:   string[] (UIDs who upvoted)
 *   downvoters: string[] (UIDs who downvoted)
 *   netScore:   number (upvotes − downvotes, for sorting)
 */

const APPROVAL_THRESHOLD = 3;
const FLAG_THRESHOLD = -3;

const SORT_OPTIONS = [
  { key: "newest", label: "New", icon: ClockIcon },
  { key: "top", label: "Top", icon: ArrowTrendingUpIcon },
  { key: "hot", label: "Hot", icon: FireIcon },
];

export default function CommunityFeed() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [expandedPhoto, setExpandedPhoto] = useState(null);
  const [votingId, setVotingId] = useState(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, "weekly_completions");
      // Fetch all non-rejected submissions
      const q = query(ref, where("status", "in", [
        "pending_review",
        "community_approved",
        "completed",
      ]));
      const snap = await getDocs(q);
      let subs = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));

      // Sort based on selected mode
      if (sortBy === "top") {
        subs.sort((a, b) => (b.netScore ?? 0) - (a.netScore ?? 0));
      } else if (sortBy === "hot") {
        // Hot = score weighted by recency
        subs.sort((a, b) => {
          const aTime = a.completedAt?.toMillis?.() ?? 0;
          const bTime = b.completedAt?.toMillis?.() ?? 0;
          const aScore = (a.netScore ?? 0) + (aTime / 3600000);
          const bScore = (b.netScore ?? 0) + (bTime / 3600000);
          return bScore - aScore;
        });
      } else {
        // newest first
        subs.sort((a, b) => {
          const aTime = a.completedAt?.toMillis?.() ?? 0;
          const bTime = b.completedAt?.toMillis?.() ?? 0;
          return bTime - aTime;
        });
      }

      setSubmissions(subs);
    } catch (err) {
      console.error("[CommunityFeed] Load error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  // ── Vote handler ──────────────────────────────────────────────────
  async function handleVote(sub, direction) {
    if (!user || votingId) return;
    if (sub.uid === user.uid) return; // can't vote on own submission

    setVotingId(sub.docId);
    try {
      const docRef = doc(db, "weekly_completions", sub.docId);
      const upvoters = sub.upvoters ?? [];
      const downvoters = sub.downvoters ?? [];
      const alreadyUp = upvoters.includes(user.uid);
      const alreadyDown = downvoters.includes(user.uid);

      const updates = {};

      if (direction === "up") {
        if (alreadyUp) {
          // Remove upvote (toggle off)
          updates.upvoters = arrayRemove(user.uid);
          updates.upvotes = increment(-1);
          updates.netScore = increment(-1);
        } else {
          // Add upvote
          updates.upvoters = arrayUnion(user.uid);
          updates.upvotes = increment(1);
          updates.netScore = increment(1);
          if (alreadyDown) {
            // Remove downvote if switching
            updates.downvoters = arrayRemove(user.uid);
            updates.downvotes = increment(-1);
            updates.netScore = increment(1); // double because removing -1 and adding +1
          }
        }
      } else {
        if (alreadyDown) {
          // Remove downvote (toggle off)
          updates.downvoters = arrayRemove(user.uid);
          updates.downvotes = increment(-1);
          updates.netScore = increment(1);
        } else {
          // Add downvote
          updates.downvoters = arrayUnion(user.uid);
          updates.downvotes = increment(1);
          updates.netScore = increment(-1);
          if (alreadyUp) {
            // Remove upvote if switching
            updates.upvoters = arrayRemove(user.uid);
            updates.upvotes = increment(-1);
            updates.netScore = increment(-1);
          }
        }
      }

      await updateDoc(docRef, updates);

      // Check if submission crossed approval threshold
      const currentNet = (sub.netScore ?? 0)
        + (direction === "up" ? (alreadyUp ? -1 : (alreadyDown ? 2 : 1)) : (alreadyDown ? 1 : (alreadyUp ? -2 : -1)));

      if (currentNet >= APPROVAL_THRESHOLD && sub.status !== "community_approved") {
        // Mark as community-approved — CLB is NOT auto-awarded here.
        // Only the weekly winner (highest net score at week end) receives CLB.
        // Use /api/award-weekly-winner to trigger the reward.
        await updateDoc(docRef, {
          status: "community_approved",
          approvedAt: serverTimestamp(),
          approvalMethod: "community_vote",
        });
      } else if (currentNet <= FLAG_THRESHOLD && sub.status !== "flagged") {
        await updateDoc(docRef, {
          status: "flagged",
          flaggedAt: serverTimestamp(),
        });
      }

      // Optimistic update for instant UI feedback
      setSubmissions((prev) =>
        prev.map((s) => {
          if (s.docId !== sub.docId) return s;
          const newUpvoters = [...(s.upvoters ?? [])];
          const newDownvoters = [...(s.downvoters ?? [])];

          if (direction === "up") {
            if (alreadyUp) {
              newUpvoters.splice(newUpvoters.indexOf(user.uid), 1);
            } else {
              newUpvoters.push(user.uid);
              if (alreadyDown) newDownvoters.splice(newDownvoters.indexOf(user.uid), 1);
            }
          } else {
            if (alreadyDown) {
              newDownvoters.splice(newDownvoters.indexOf(user.uid), 1);
            } else {
              newDownvoters.push(user.uid);
              if (alreadyUp) newUpvoters.splice(newUpvoters.indexOf(user.uid), 1);
            }
          }

          return {
            ...s,
            upvoters: newUpvoters,
            downvoters: newDownvoters,
            upvotes: newUpvoters.length,
            downvotes: newDownvoters.length,
            netScore: newUpvoters.length - newDownvoters.length,
            status: (newUpvoters.length - newDownvoters.length) >= APPROVAL_THRESHOLD
              ? "community_approved" : s.status,
          };
        })
      );
    } catch (err) {
      console.error("[CommunityFeed] Vote error:", err.message);
    } finally {
      setVotingId(null);
    }
  }

  const approvedCount = submissions.filter((s) => s.status === "community_approved").length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🌍 Community Feed
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Vote on SDG task submissions. {approvedCount > 0 && (
            <span className="text-emerald-500 font-medium">{approvedCount} community-approved</span>
          )}
        </p>
      </div>

      {/* Sort tabs */}
      <div className="flex items-center gap-2">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              sortBy === opt.key
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                : "bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-dark-muted hover:bg-gray-200 dark:hover:bg-dark-border"
            }`}
          >
            <opt.icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center gap-3 py-16 justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
          <span className="text-sm text-gray-400">Loading submissions…</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20">
          <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-dark-border mx-auto mb-3" />
          <p className="text-gray-400 dark:text-dark-muted">
            No submissions yet. Complete a weekly SDG task to be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <SubmissionPost
              key={sub.docId}
              sub={sub}
              currentUid={user?.uid}
              onVote={(dir) => handleVote(sub, dir)}
              onViewPhoto={() => setExpandedPhoto(sub.photoBase64)}
              isVoting={votingId === sub.docId}
            />
          ))}
        </div>
      )}

      {/* Full-screen photo modal */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setExpandedPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={expandedPhoto}
              alt="Full submission"
              className="rounded-xl max-h-[85vh] w-auto object-contain"
            />
            <button
              onClick={() => setExpandedPhoto(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Individual Post Card ─────────────────────────────────────────────
function SubmissionPost({ sub, currentUid, onVote, onViewPhoto, isVoting }) {
  const isOwn = sub.uid === currentUid;
  const upvoters = sub.upvoters ?? [];
  const downvoters = sub.downvoters ?? [];
  const hasUpvoted = currentUid ? upvoters.includes(currentUid) : false;
  const hasDownvoted = currentUid ? downvoters.includes(currentUid) : false;
  const netScore = sub.netScore ?? 0;
  const isApproved = sub.status === "community_approved";

  const completedDate = sub.completedAt?.toDate
    ? sub.completedAt.toDate().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date";

  const sdgNum = sub.sdgGoal ?? 15;

  return (
    <div className={`rounded-xl border transition-all ${
      isApproved
        ? "bg-emerald-50/50 dark:bg-emerald-900/5 border-emerald-200 dark:border-emerald-800/40"
        : "bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border"
    }`}>
      <div className="flex">
        {/* ── Vote column (Reddit-style left gutter) ── */}
        <div className="flex flex-col items-center gap-0.5 px-3 py-4">
          <button
            onClick={() => onVote("up")}
            disabled={isOwn || isVoting}
            title={isOwn ? "Can't vote on your own" : "Upvote"}
            className={`p-1.5 rounded-lg transition-all ${
              hasUpvoted
                ? "text-emerald-500 bg-emerald-500/10"
                : isOwn
                ? "text-gray-300 dark:text-dark-border cursor-not-allowed"
                : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
            }`}
          >
            {hasUpvoted ? (
              <ThumbUpSolid className="w-5 h-5" />
            ) : (
              <HandThumbUpIcon className="w-5 h-5" />
            )}
          </button>

          <span className={`text-sm font-bold tabular-nums ${
            netScore > 0 ? "text-emerald-500" : netScore < 0 ? "text-red-400" : "text-gray-400"
          }`}>
            {netScore}
          </span>

          <button
            onClick={() => onVote("down")}
            disabled={isOwn || isVoting}
            title={isOwn ? "Can't vote on your own" : "Downvote"}
            className={`p-1.5 rounded-lg transition-all ${
              hasDownvoted
                ? "text-red-400 bg-red-400/10"
                : isOwn
                ? "text-gray-300 dark:text-dark-border cursor-not-allowed"
                : "text-gray-400 hover:text-red-400 hover:bg-red-400/10"
            }`}
          >
            <HandThumbDownIcon className="w-5 h-5" />
          </button>
        </div>

        {/* ── Content column ── */}
        <div className="flex-1 py-4 pr-4">
          {/* Author row */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{SDG_ICONS[sdgNum] ?? "🌱"}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {sub.displayName || "Anonymous"}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-dark-muted">
              · {completedDate}
            </span>
            {isApproved && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                <CheckBadgeIcon className="w-3 h-3" /> Verified
              </span>
            )}
            {isOwn && (
              <span className="text-[10px] font-medium text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>

          {/* SDG tag */}
          <div className="mb-2 flex items-center flex-wrap gap-1.5">
            <span className="text-[11px] font-medium text-gray-500 dark:text-dark-muted bg-gray-100 dark:bg-dark-bg px-2 py-0.5 rounded-full">
              SDG {sdgNum}: {SDG_GOALS[sdgNum] ?? "Sustainable Action"}
            </span>
            {sub.clbAwarded ? (
              <span className="text-[10px] font-semibold text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                🏆 Weekly Winner · CLB Awarded
              </span>
            ) : isApproved ? (
              <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                Community Approved
              </span>
            ) : null}
          </div>

          {/* Photo */}
          {sub.photoBase64 && (
            <button onClick={onViewPhoto} className="relative group w-full mb-3">
              <img
                src={sub.photoBase64}
                alt="Submission"
                className="w-full rounded-lg max-h-64 object-cover border border-gray-100 dark:border-dark-border"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors" />
            </button>
          )}

          {/* Response text */}
          {sub.response && (
            <p className="text-sm text-gray-700 dark:text-dark-text leading-relaxed mb-2">
              {sub.response}
            </p>
          )}

          {/* Footer stats */}
          <div className="flex items-center gap-4 text-[11px] text-gray-400 dark:text-dark-muted">
            <span>{upvoters.length} upvote{upvoters.length !== 1 ? "s" : ""}</span>
            <span>{sub.taskId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
