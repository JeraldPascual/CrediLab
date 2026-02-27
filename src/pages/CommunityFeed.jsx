import { useState, useEffect } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PhotoIcon,
  CheckBadgeIcon,
  ClockIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronUpIcon as ChevronUpSolid,
} from "@heroicons/react/24/solid";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { SDG_ICONS, SDG_GOALS, getCurrentWeekNumber } from "../data/weeklyTasks";
import { getSkillTier } from "../data/achievements";
import UserProfileCard from "../components/UserProfileCard";
import TierFrame from "../components/TierFrame";

/**
 * Community Feed — /student/community
 *
 * Reddit-style upvote/downvote feed for weekly SDG task submissions.
 * Uses Firestore onSnapshot for real-time updates — no manual refresh needed.
 *
 * Voting rules:
 *   - Each user gets ONE vote per submission (up or down, can toggle)
 *   - Net score (upvotes − downvotes) determines visibility & validity
 *   - Submissions with ≥3 net upvotes → "community_approved"
 *   - Submissions with ≤ −3 net downvotes → flagged for review
 */

const APPROVAL_THRESHOLD = 3;
const FLAG_THRESHOLD = -3;

const SORT_OPTIONS = [
  { key: "newest", label: "New", icon: ClockIcon },
  { key: "top", label: "Top", icon: ArrowTrendingUpIcon },
  { key: "hot", label: "Hot", icon: FireIcon },
];

// Cache user profiles so hover cards and name lookups don't re-fetch
const profileCache = new Map();

async function resolveProfile(uid) {
  if (profileCache.has(uid)) return profileCache.get(uid);
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const d = snap.data();
      const clb = d.totalCLBEarned ?? d.credits ?? 0;
      const p = {
        displayName: d.displayName || `${d.firstName || ""} ${d.lastName || ""}`.trim() || "Anonymous",
        photoURL: d.photoURL || null,
        tier: getSkillTier(clb),
      };
      profileCache.set(uid, p);
      return p;
    }
  } catch (err) {
    console.warn("[CommunityFeed] profile fetch:", err.message);
  }
  return { displayName: "Anonymous", photoURL: null, tier: getSkillTier(0) };
}

export default function CommunityFeed() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [votingId, setVotingId] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");

  // ── Real-time Firestore listener ──────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const ref = collection(db, "weekly_completions");
    const q = query(ref, where("status", "in", [
      "pending_review",
      "community_approved",
      "completed",
      "weekly_winner",
    ]));

    const unsub = onSnapshot(q, async (snap) => {
      let subs = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));

      // Resolve dynamic user names/photos
      const uids = [...new Set(subs.map((s) => s.uid).filter(Boolean))];
      await Promise.all(uids.map(resolveProfile));

      subs = subs.map((s) => {
        const p = profileCache.get(s.uid);
        return { ...s, _name: p?.displayName || s.displayName || "Anonymous", _photo: p?.photoURL || null, _tier: p?.tier || getSkillTier(0) };
      });

      setSubmissions(subs);
      setLoading(false);
    }, (err) => {
      console.error("[CommunityFeed] onSnapshot:", err.message);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ── Client-side sort ──────────────────────────────────────────────
  const sorted = [...submissions].sort((a, b) => {
    if (sortBy === "top") return (b.netScore ?? 0) - (a.netScore ?? 0);
    if (sortBy === "hot") {
      const now = Date.now();
      const aAge = (now - (a.completedAt?.toMillis?.() ?? 0)) / 3_600_000; // hours
      const bAge = (now - (b.completedAt?.toMillis?.() ?? 0)) / 3_600_000;
      const aHot = (a.netScore ?? 0) / Math.pow(aAge + 2, 1.5);
      const bHot = (b.netScore ?? 0) / Math.pow(bAge + 2, 1.5);
      return bHot - aHot;
    }
    return (b.completedAt?.toMillis?.() ?? 0) - (a.completedAt?.toMillis?.() ?? 0);
  });

  // ── Vote handler ──────────────────────────────────────────────────
  async function handleVote(sub, direction) {
    if (!user || votingId) return;
    if (sub.uid === user.uid) return;

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
          updates.upvoters = arrayRemove(user.uid);
          updates.upvotes = increment(-1);
          updates.netScore = increment(-1);
        } else {
          updates.upvoters = arrayUnion(user.uid);
          updates.upvotes = increment(1);
          updates.netScore = increment(1);
          if (alreadyDown) {
            updates.downvoters = arrayRemove(user.uid);
            updates.downvotes = increment(-1);
            updates.netScore = increment(1);
          }
        }
      } else {
        if (alreadyDown) {
          updates.downvoters = arrayRemove(user.uid);
          updates.downvotes = increment(-1);
          updates.netScore = increment(1);
        } else {
          updates.downvoters = arrayUnion(user.uid);
          updates.downvotes = increment(1);
          updates.netScore = increment(-1);
          if (alreadyUp) {
            updates.upvoters = arrayRemove(user.uid);
            updates.upvotes = increment(-1);
            updates.netScore = increment(-1);
          }
        }
      }

      await updateDoc(docRef, updates);

      // ── Track voter activity on the VOTER's user document (Mentor Spirit badge) ──
      const isNewVote = (direction === "up" && !alreadyUp) || (direction === "down" && !alreadyDown);
      const isRemovingVote = (direction === "up" && alreadyUp) || (direction === "down" && alreadyDown);
      if (isNewVote && !isRemovingVote) {
        try {
          const voterRef = doc(db, "users", user.uid);
          await updateDoc(voterRef, { communityVotesGiven: increment(1) });
        } catch {
          // Silent — badge tracking is best-effort
        }
      }

      const currentNet = (sub.netScore ?? 0)
        + (direction === "up"
          ? (alreadyUp ? -1 : (alreadyDown ? 2 : 1))
          : (alreadyDown ? 1 : (alreadyUp ? -2 : -1)));

      if (currentNet >= APPROVAL_THRESHOLD && sub.status !== "community_approved") {
        await updateDoc(docRef, { status: "community_approved", approvedAt: serverTimestamp(), approvalMethod: "community_vote" });
        // ── Track approval on submission OWNER's user doc (Community Voice badge) ──
        try {
          const ownerRef = doc(db, "users", sub.uid);
          await updateDoc(ownerRef, { communityApprovals: increment(1) });
        } catch {
          // Silent — badge tracking is best-effort
        }
      } else if (currentNet <= FLAG_THRESHOLD && sub.status !== "flagged") {
        await updateDoc(docRef, { status: "flagged", flaggedAt: serverTimestamp() });
      }

      // Optimistic UI update
      setSubmissions((prev) =>
        prev.map((s) => {
          if (s.docId !== sub.docId) return s;
          const newUp = [...(s.upvoters ?? [])];
          const newDown = [...(s.downvoters ?? [])];
          if (direction === "up") {
            if (alreadyUp) newUp.splice(newUp.indexOf(user.uid), 1);
            else { newUp.push(user.uid); if (alreadyDown) newDown.splice(newDown.indexOf(user.uid), 1); }
          } else {
            if (alreadyDown) newDown.splice(newDown.indexOf(user.uid), 1);
            else { newDown.push(user.uid); if (alreadyUp) newUp.splice(newUp.indexOf(user.uid), 1); }
          }
          return {
            ...s, upvoters: newUp, downvoters: newDown,
            upvotes: newUp.length, downvotes: newDown.length,
            netScore: newUp.length - newDown.length,
            status: (newUp.length - newDown.length) >= APPROVAL_THRESHOLD ? "community_approved" : s.status,
          };
        })
      );
    } catch (err) {
      console.error("[CommunityFeed] Vote error:", err.message);
    } finally {
      setVotingId(null);
    }
  }

  const approvedCount = sorted.filter((s) => s.status === "community_approved" && !s.clbAwarded).length;
  const currentWeek = getCurrentWeekNumber();

  // A submission is a winner if: clbAwarded is set (any truthy value) OR status is weekly_winner
  // Using truthy check (not strict ===) to handle manual Firestore edits where type may vary
  const isWinner = (s) => !!s.clbAwarded || s.status === "weekly_winner";
  // Feed shows only current week, non-winner posts
  const activePosts = sorted.filter((s) => !isWinner(s) && (s.weekNumber ?? currentWeek) === currentWeek);
  // Hall of Fame shows all weeks' winners
  const hallOfFame = sorted.filter(isWinner).sort((a, b) => (b.weekNumber ?? 0) - (a.weekNumber ?? 0));

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UserGroupIcon className="w-7 h-7 text-green-primary" />
          Community Feed
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Vote on SDG task submissions. {approvedCount > 0 && (
            <span className="text-emerald-500 font-medium">{approvedCount} community-approved</span>
          )}
        </p>
      </div>

      {/* ── Primary tabs: Feed / Hall of Fame ── */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-dark-surface rounded-xl">
        <button
          onClick={() => setActiveTab("feed")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
            activeTab === "feed"
              ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm"
              : "text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-white"
          }`}
        >
          <UserGroupIcon className="w-3.5 h-3.5" />
          Feed
        </button>
        <button
          onClick={() => setActiveTab("hof")}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
            activeTab === "hof"
              ? "bg-white dark:bg-dark-card text-amber-600 dark:text-amber-400 shadow-sm"
              : "text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-white"
          }`}
        >
          <TrophyIcon className="w-3.5 h-3.5" />
          Hall of Fame
          {hallOfFame.length > 0 && (
            <span className="ml-0.5 text-[9px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full">
              {hallOfFame.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Hall of Fame Tab ── */}
      {activeTab === "hof" && (
        <div className="space-y-3">
          {hallOfFame.length === 0 ? (
            <div className="text-center py-16">
              <TrophyIcon className="w-10 h-10 text-gray-300 dark:text-dark-border mx-auto mb-3" />
              <p className="text-gray-400 dark:text-dark-muted text-sm">No weekly winners yet.</p>
              <p className="text-gray-400 dark:text-dark-muted text-xs mt-1">Winners appear here after the weekly award is triggered.</p>
            </div>
          ) : hallOfFame.map((w) => {
            const wProfile = profileCache.get(w.uid);
            const wTier = wProfile?.tier || getSkillTier(0);
            return (
              <div key={w.docId} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50/80 to-yellow-50/40 dark:from-amber-900/10 dark:to-yellow-900/5 border border-amber-200/60 dark:border-amber-700/20">
                <UserProfileCard uid={w.uid} name={w._name} photoURL={w._photo}>
                  <div className="cursor-pointer">
                    <TierFrame tier={wTier} size="sm">
                      {w._photo ? (
                        <img src={w._photo} alt={w._name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center text-sm font-bold text-amber-800">
                          {(w._name || "?")[0].toUpperCase()}
                        </div>
                      )}
                    </TierFrame>
                  </div>
                </UserProfileCard>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">🏆</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{w._name}</p>
                  </div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                    Week {w.weekNumber} · {w.awardedReward ?? w.rewardCLB ?? 35} CLB awarded
                  </p>
                  {w.response && (
                    <p className="text-[11px] text-gray-500 dark:text-dark-muted mt-1 line-clamp-2 leading-snug">{w.response}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">🏅 {w.netScore ?? 0} votes</span>
                  <span className="text-[9px] text-gray-400 dark:text-dark-muted">{SDG_ICONS[w.sdgGoal ?? 15]} SDG {w.sdgGoal ?? 15}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Feed Tab ── */}
      {activeTab === "feed" && (
        <>
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
          ) : activePosts.length === 0 ? (
            <div className="text-center py-20">
              <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-dark-border mx-auto mb-3" />
              <p className="text-gray-400 dark:text-dark-muted">
                No submissions yet. Complete a weekly SDG task to be the first!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePosts.map((sub) => (
                <SubmissionPost
                  key={sub.docId}
                  sub={sub}
                  currentUid={user?.uid}
                  onVote={(dir) => handleVote(sub, dir)}
                  isVoting={votingId === sub.docId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Individual Post Card ─────────────────────────────────────────────
function SubmissionPost({ sub, currentUid, onVote, isVoting }) {
  const isOwn = sub.uid === currentUid;
  const upvoters = sub.upvoters ?? [];
  const downvoters = sub.downvoters ?? [];
  const hasUpvoted = currentUid ? upvoters.includes(currentUid) : false;
  const hasDownvoted = currentUid ? downvoters.includes(currentUid) : false;
  const netScore = sub.netScore ?? 0;
  const isApproved = sub.status === "community_approved";
  const tier = sub._tier || getSkillTier(0);

  const completedDate = sub.completedAt?.toDate
    ? sub.completedAt.toDate().toLocaleDateString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "Unknown date";

  const sdgNum = sub.sdgGoal ?? 15;
  const displayName = sub._name || sub.displayName || "Anonymous";
  const photoURL = sub._photo || null;

  return (
    <div className={`rounded-xl border transition-all ${
      isApproved
        ? "bg-emerald-50/50 dark:bg-emerald-900/5 border-emerald-200 dark:border-emerald-800/40"
        : "bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border"
    }`}>
      <div className="flex">
        {/* ── Vote column — Reddit-style chevron arrows ── */}
        <div className="flex flex-col items-center gap-0.5 px-3 py-4">
          <button
            onClick={() => onVote("up")}
            disabled={isOwn || isVoting}
            title={isOwn ? "Can't vote on your own" : "Upvote"}
            className={`p-1 rounded-md transition-all ${
              hasUpvoted
                ? "text-emerald-500 bg-emerald-500/10"
                : isOwn ? "text-gray-300 dark:text-dark-border cursor-not-allowed"
                : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
            }`}
          >
            {hasUpvoted
              ? <ChevronUpSolid className="w-6 h-6" />
              : <ChevronUpIcon className="w-6 h-6" />}
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
            className={`p-1 rounded-md transition-all ${
              hasDownvoted
                ? "text-red-400 bg-red-400/10"
                : isOwn ? "text-gray-300 dark:text-dark-border cursor-not-allowed"
                : "text-gray-400 hover:text-red-400 hover:bg-red-400/10"
            }`}
          >
            <ChevronDownIcon className="w-6 h-6" />
          </button>
        </div>

        {/* ── Content column ── */}
        <div className="flex-1 py-4 pr-4">
          {/* Author row — avatar with hoverable profile card */}
          <div className="flex items-center gap-2 mb-2">
            <UserProfileCard uid={sub.uid} name={displayName} photoURL={photoURL}>
              <button className="flex items-center gap-2 group">
                <TierFrame tier={tier} size="xs">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-primary/30 to-emerald-400/30 flex items-center justify-center text-xs font-bold text-green-primary">
                      {(displayName || "?")[0].toUpperCase()}
                    </div>
                  )}
                </TierFrame>
                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-green-primary transition-colors">
                  {displayName}
                </span>
              </button>
            </UserProfileCard>

            <span className="text-base">{SDG_ICONS[sdgNum] ?? "🌱"}</span>
            <span className="text-[11px] text-gray-400 dark:text-dark-muted">· {completedDate}</span>
            {isApproved && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                <CheckBadgeIcon className="w-3 h-3" /> Verified
              </span>
            )}
            {isOwn && (
              <span className="text-[10px] font-medium text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">You</span>
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
              <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">Community Approved</span>
            ) : null}
          </div>

          {/* Photo — full-view inline, scrollable, no click to expand */}
          {sub.photoBase64 && (
            <div className="w-full mb-3">
              <img
                src={sub.photoBase64}
                alt="Submission photo"
                className="w-full rounded-lg object-contain border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg"
              />
            </div>
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
