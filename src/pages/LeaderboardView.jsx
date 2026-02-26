import { useState, useEffect } from "react";
import { TrophyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { getSkillTier } from "../data/achievements";
import UserProfileCard from "../components/UserProfileCard";
import TierFrame from "../components/TierFrame";

export default function LeaderboardView() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      const entries = snap.docs
        .map((d) => {
          const data = d.data();
          const earned = data.totalCLBEarned ?? data.credits ?? 0;
          return {
            uid: d.id,
            name: data.displayName || data.email || "Anonymous",
            credits: earned,
            challenges: data.completedChallenges?.length || 0,
            photoURL: data.photoURL || null,
            tier: getSkillTier(earned),
          };
        })
        .filter((e) => e.challenges > 0 || e.credits > 0)
        .sort((a, b) => b.credits - a.credits)
        .slice(0, 20)
        .map((e, i) => ({ ...e, rank: i + 1 }));
      setLeaderboard(entries);
      setLoading(false);
    }, (err) => {
      console.warn("Leaderboard fetch failed (ad blocker?):", err.message);
      setLeaderboard([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrophyIcon className="w-7 h-7 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Top students ranked by credits earned.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-green-primary border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-sm text-gray-500 dark:text-dark-muted">Loading leaderboard…</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-dark-muted">
            <p className="text-sm">No leaderboard data available yet.</p>
            <p className="text-xs mt-1">Complete challenges to appear here!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-surface text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wider">
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3 text-right">Challenges</th>
                <th className="px-6 py-3 text-right">Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
              {leaderboard.map((entry) => (
                <tr
                  key={entry.uid}
                  className={`hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors ${
                    entry.uid === user?.uid
                      ? "bg-emerald-50 dark:bg-green-primary/5"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <RankBadge rank={entry.rank} />
                  </td>
                  <td className="px-6 py-4">
                    <UserProfileCard uid={entry.uid} name={entry.name} photoURL={entry.photoURL}>
                      <div className="flex items-center gap-3 group cursor-pointer">
                        <TierFrame tier={entry.tier} size="xs">
                          {entry.photoURL ? (
                            <img
                              src={entry.photoURL}
                              alt={entry.name}
                              className="w-8 h-8 rounded-full object-cover group-hover:brightness-110 transition"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-primary/30 to-emerald-400/30 flex items-center justify-center text-sm font-bold text-green-primary group-hover:ring-2 group-hover:ring-green-primary/30 transition-all">
                              {(entry.name || "?")[0].toUpperCase()}
                            </div>
                          )}
                        </TierFrame>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-primary transition-colors">
                              {entry.name}
                            </span>
                            {entry.uid === user?.uid && (
                              <span className="text-xs text-green-primary font-semibold">(You)</span>
                            )}
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${entry.tier.bg} ${entry.tier.color}`}>
                            {entry.tier.icon} {entry.tier.shortTitle}
                          </span>
                        </div>
                      </div>
                    </UserProfileCard>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-dark-muted text-right">
                    {entry.challenges}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-green-primary">
                      {entry.credits} CLB
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-dark-muted">
        Leaderboard updates when challenges are completed and verified on-chain.
      </p>
    </div>
  );
}

function RankBadge({ rank }) {
  const medals = { 1: "\u{1F947}", 2: "\u{1F948}", 3: "\u{1F949}" };
  if (medals[rank]) return <span className="text-xl">{medals[rank]}</span>;
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-dark-surface text-xs font-bold text-gray-600 dark:text-dark-muted">
      {rank}
    </span>
  );
}
